"""Build golden dataset from real Gmail data for email classification eval."""

import json
import logging
from pathlib import Path

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

logging.basicConfig(
    filename="email_agent.log",
    level=logging.INFO,
    format='{"ts":"%(asctime)s","level":"%(levelname)s","msg":"%(message)s"}',
)
log = logging.getLogger(__name__)

TOKEN_FILE = Path(__file__).parent / "token.json"
GOLDEN_FILE = Path(__file__).parent / "golden.jsonl"


def get_gmail_service():
    with open(TOKEN_FILE) as f:
        token_data = json.load(f)
    creds = Credentials.from_authorized_user_info(token_data)
    return build("gmail", "v1", credentials=creds)


def fetch_emails(service, label_ids=None, query=None, max_results=50):
    """Fetch emails with metadata."""
    params = {"userId": "me", "maxResults": max_results}
    if label_ids:
        params["labelIds"] = label_ids
    if query:
        params["q"] = query

    results = service.users().messages().list(**params).execute()
    messages = results.get("messages", [])

    emails = []
    for msg in messages:
        try:
            full = service.users().messages().get(
                userId="me", id=msg["id"], format="metadata",
                metadataHeaders=["Subject", "From", "To", "Date"]
            ).execute()
            headers = {h["name"]: h["value"] for h in full["payload"]["headers"]}
            emails.append({
                "id": msg["id"],
                "subject": headers.get("Subject", "(no subject)"),
                "sender": headers.get("From", "unknown"),
                "body_preview": full.get("snippet", "")[:500],
                "labels": full.get("labelIds", []),
                "timestamp": headers.get("Date", ""),
            })
        except Exception as e:
            log.warning(f"Failed to fetch message {msg['id']}: {e}")
    return emails


def label_from_behavior(email: dict, source: str) -> str:
    """Assign action label based on which Gmail folder/behavior the email came from.

    source: 'trash', 'starred', 'sent', 'spam', 'inbox'
    """
    if source == "trash":
        return "archive"
    if source == "spam":
        return "archive"
    if source == "starred":
        # Starred emails are mostly bills or important items
        subj = (email.get("subject", "") + " " + email.get("body_preview", "")).lower()
        bill_signals = [
            "rechnung", "invoice", "рахунок", "оплата", "zahlungserinnerung",
            "payment", "betrag", "fällig", "vorschreibung", "ihre rechnung",
        ]
        if any(s in subj for s in bill_signals):
            return "pay"
        return "save_to_minime"  # starred non-bills = important/opportunities
    if source == "sent":
        return "reply"  # emails user replied to
    # inbox default
    return "read"


def build_golden_set(
    trash_count: int = 50,
    starred_count: int = 30,
    sent_count: int = 30,
    spam_count: int = 50,
    inbox_count: int = 40,
):
    """Build golden dataset from real Gmail behavior."""
    service = get_gmail_service()

    datasets = {
        "trash": (["TRASH"], trash_count),
        "starred": (["STARRED"], starred_count),
        "sent": (["SENT"], sent_count),
        "spam": (["SPAM"], spam_count),
        "inbox": (["INBOX"], inbox_count),
    }

    all_emails = []
    seen_ids = set()

    for source, (labels, count) in datasets.items():
        log.info(f"Fetching {count} emails from {source}")
        emails = fetch_emails(service, label_ids=labels, max_results=count)

        for email in emails:
            if email["id"] in seen_ids:
                continue
            seen_ids.add(email["id"])
            email["user_action"] = label_from_behavior(email, source)
            all_emails.append(email)

        print(f"  {source}: {len(emails)} fetched, labeled as '{label_from_behavior({'subject':'','body_preview':''}, source)}' (default)")

    # Write golden set
    with open(GOLDEN_FILE, "w") as f:
        for email in all_emails:
            f.write(json.dumps(email, ensure_ascii=False) + "\n")

    # Stats
    from collections import Counter
    action_counts = Counter(e["user_action"] for e in all_emails)
    print(f"\nGolden dataset: {len(all_emails)} emails → {GOLDEN_FILE}")
    print("Distribution:")
    for action, count in sorted(action_counts.items(), key=lambda x: -x[1]):
        print(f"  {action}: {count}")

    return all_emails


if __name__ == "__main__":
    build_golden_set()
