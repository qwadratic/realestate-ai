"""Email classifier using Claude Sonnet API."""

import json
import logging
import time
from pathlib import Path
from typing import Any

import anthropic
from dotenv import load_dotenv

load_dotenv()

# Structured JSON logging
logger = logging.getLogger("email_agent")
_log_handler = logging.FileHandler("email_agent.log")
_log_handler.setFormatter(logging.Formatter(json.dumps({
    "time": "%(asctime)s",
    "level": "%(levelname)s",
    "message": "%(message)s",
})))
logger.addHandler(_log_handler)
logger.setLevel(logging.INFO)

MODEL = "claude-sonnet-4-6"
MAX_BODY_CHARS = 2000

DEFAULT_RESULT: dict[str, Any] = {
    "action": "read",
    "suggestion": "Review manually",
    "confidence": 0.0,
    "reasoning": "Classification failed",
}

REQUIRED_FIELDS = {"action", "suggestion", "confidence", "reasoning"}
VALID_ACTIONS = {"archive", "reply", "pay", "read", "delegate", "save_to_minime"}

_client: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic()
    return _client


PROMPT_FILES = {
    "v1": "v1_classify.txt",
    "v2": "v2_classify.txt",
    "v3": "v3_classify.txt",
    "v4": "v4_ivan_profile.txt",
}


def load_prompt(variant: str = "v3") -> str:
    """Load prompt template by variant name."""
    filename = PROMPT_FILES.get(variant, f"{variant}_classify.txt")
    path = Path(__file__).parent / "prompts" / filename
    if not path.exists():
        raise FileNotFoundError(f"Prompt file not found: {path}")
    return path.read_text()


def _render_prompt(template: str, subject: str, sender: str, body_preview: str) -> str:
    """Fill template placeholders."""
    return (
        template
        .replace("{{subject}}", subject)
        .replace("{{sender}}", sender)
        .replace("{{body_preview}}", body_preview[:MAX_BODY_CHARS])
    )


def _validate_result(data: Any) -> dict[str, Any] | None:
    """Validate parsed JSON has required fields and valid action. Returns None on failure."""
    if not isinstance(data, dict):
        return None
    if not REQUIRED_FIELDS.issubset(data.keys()):
        return None
    if data.get("action") not in VALID_ACTIONS:
        return None
    return data


def _parse_json_response(text: str) -> dict[str, Any] | None:
    """Try to extract JSON from response text."""
    text = text.strip()
    # Strip markdown fences if present
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None


def _call_api(prompt: str) -> str | None:
    """Call Claude API with retry logic for timeouts (2x) and rate limits (3x)."""
    client = _get_client()
    max_retries_timeout = 2
    max_retries_rate = 3
    timeout_attempts = 0
    rate_attempts = 0
    backoff = 1.0

    while True:
        try:
            response = client.messages.create(
                model=MODEL,
                max_tokens=512,
                messages=[{"role": "user", "content": prompt}],
            )
            # Check for refusal
            if response.stop_reason == "end_turn" and response.content:
                block = response.content[0]
                if hasattr(block, "text"):
                    return block.text
            # Refusal or empty
            logger.warning("API returned no usable content, stop_reason=%s", response.stop_reason)
            return None

        except anthropic.RateLimitError:
            rate_attempts += 1
            if rate_attempts > max_retries_rate:
                logger.error("Rate limit exceeded after %d retries", max_retries_rate)
                return None
            logger.warning("Rate limited, backing off %.1fs (attempt %d/%d)", backoff, rate_attempts, max_retries_rate)
            time.sleep(backoff)
            backoff *= 2

        except anthropic.APITimeoutError:
            timeout_attempts += 1
            if timeout_attempts > max_retries_timeout:
                logger.error("API timeout after %d retries", max_retries_timeout)
                return None
            logger.warning("API timeout, backing off %.1fs (attempt %d/%d)", backoff, timeout_attempts, max_retries_timeout)
            time.sleep(backoff)
            backoff *= 2

        except anthropic.APIError as e:
            logger.error("API error: %s", e)
            return None


def classify_email(
    subject: str,
    sender: str,
    body_preview: str,
    variant: str = "v3",
) -> dict[str, Any]:
    """
    Call Claude Sonnet to classify an email.

    Returns: {action, suggestion, confidence, reasoning}
    Falls back to a safe default on any failure.
    """
    template = load_prompt(variant)
    prompt = _render_prompt(template, subject, sender, body_preview)

    logger.info(json.dumps({
        "event": "classify_start",
        "subject": subject,
        "sender": sender,
        "variant": variant,
    }))

    # First attempt
    raw = _call_api(prompt)
    if raw is None:
        logger.warning("API call returned None, returning default")
        return dict(DEFAULT_RESULT)

    parsed = _parse_json_response(raw)
    result = _validate_result(parsed) if parsed else None

    # Retry once on invalid JSON / wrong schema
    if result is None:
        logger.warning("Invalid response on first attempt, retrying once")
        raw = _call_api(prompt)
        if raw is None:
            return dict(DEFAULT_RESULT)
        parsed = _parse_json_response(raw)
        result = _validate_result(parsed) if parsed else None

    if result is None:
        logger.warning("Invalid response after retry, returning default")
        return dict(DEFAULT_RESULT)

    # Normalize confidence to float
    try:
        result["confidence"] = float(result["confidence"])
    except (ValueError, TypeError):
        result["confidence"] = 0.0

    logger.info(json.dumps({
        "event": "classify_done",
        "subject": subject,
        "action": result["action"],
        "confidence": result["confidence"],
    }))

    return result


def classify_batch(
    emails: list[dict],
    variant: str = "v3",
) -> list[dict[str, Any]]:
    """Classify a list of emails. Each email dict has: subject, sender, body_preview."""
    results = []
    for email in emails:
        result = classify_email(
            subject=email["subject"],
            sender=email["sender"],
            body_preview=email["body_preview"],
            variant=variant,
        )
        results.append(result)
    return results


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Classify email using Claude")
    parser.add_argument("--subject", required=True, help="Email subject")
    parser.add_argument("--sender", required=True, help="Email sender")
    parser.add_argument("--snippet", required=True, help="Email body snippet")
    parser.add_argument("--variant", default="v4", help="Prompt variant (default: v4)")
    
    args = parser.parse_args()
    
    result = classify_email(
        subject=args.subject,
        sender=args.sender,
        body_preview=args.snippet,
        variant=args.variant
    )
    
    # Output JSON for the extension to parse
    print(json.dumps(result))
