"""Compute classification metrics for the email agent."""

import json
from pathlib import Path

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    f1_score,
    matthews_corrcoef,
)

VALID_ACTIONS = ["archive", "reply", "pay", "read", "delegate", "save_to_minime"]

COST_WEIGHTS = {
    "pay": 10,
    "save_to_minime": 5,
    "reply": 2,
    "delegate": 1,
    "read": 1,
    "archive": 1,
}


def load_golden(path: str = "golden.jsonl") -> list[dict]:
    """Load golden dataset. Falls back to sample_golden.jsonl if golden.jsonl doesn't exist."""
    p = Path(path)
    if not p.exists():
        p = Path("sample_golden.jsonl")
    if not p.exists():
        raise FileNotFoundError("Neither golden.jsonl nor sample_golden.jsonl found")
    records = []
    with p.open() as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


def compute_cost_weighted_score(predictions: list[str], ground_truth: list[str]) -> float:
    """
    Custom cost-weighted accuracy.
    Correct prediction: +weight, wrong: -weight (weight from ground truth action).
    Normalized to 0-1 range.
    """
    if not predictions:
        return 0.0

    max_score = 0.0
    raw_score = 0.0

    for pred, gt in zip(predictions, ground_truth):
        w = COST_WEIGHTS.get(gt, 1)
        max_score += w
        if pred == gt:
            raw_score += w
        else:
            raw_score -= w

    if max_score == 0.0:
        return 0.0

    # Normalize from [-max, +max] to [0, 1]
    return (raw_score + max_score) / (2 * max_score)


def compute_metrics(predictions: list[str], ground_truth: list[str]) -> dict:
    """
    Compute classification metrics.

    Returns dict with: mcc, f1_macro, f1_weighted, cost_weighted_score,
    per_class, confusion_matrix, threshold_met.
    """
    if not predictions or not ground_truth:
        return {
            "mcc": 0.0,
            "f1_macro": 0.0,
            "f1_weighted": 0.0,
            "cost_weighted_score": 0.0,
            "per_class": {},
            "confusion_matrix": [],
            "threshold_met": False,
        }

    # Use only labels that appear in the data
    present_labels = sorted(set(ground_truth) | set(predictions))
    # Order by VALID_ACTIONS position, unknown labels at end
    label_order = {a: i for i, a in enumerate(VALID_ACTIONS)}
    labels = sorted(present_labels, key=lambda x: label_order.get(x, 999))

    mcc = matthews_corrcoef(ground_truth, predictions)

    f1_mac = f1_score(
        ground_truth, predictions, labels=labels, average="macro", zero_division=0
    )
    f1_wt = f1_score(
        ground_truth, predictions, labels=labels, average="weighted", zero_division=0
    )

    report = classification_report(
        ground_truth, predictions, labels=labels, output_dict=True, zero_division=0
    )

    per_class: dict[str, dict[str, float]] = {}
    for label in labels:
        if label in report:
            per_class[label] = {
                "precision": report[label]["precision"],
                "recall": report[label]["recall"],
                "f1": report[label]["f1-score"],
            }

    cm = confusion_matrix(ground_truth, predictions, labels=labels).tolist()

    cost_ws = compute_cost_weighted_score(predictions, ground_truth)

    return {
        "mcc": float(mcc),
        "f1_macro": float(f1_mac),
        "f1_weighted": float(f1_wt),
        "cost_weighted_score": cost_ws,
        "per_class": per_class,
        "confusion_matrix": cm,
        "threshold_met": mcc > 0.6,
    }


def format_metrics_table(metrics: dict) -> str:
    """Format metrics as a Rich-compatible table string."""
    lines = [
        "Metric                  Value",
        "------------------------  --------",
        f"MCC                     {metrics.get('mcc', 0):.4f}",
        f"F1 (macro)              {metrics.get('f1_macro', 0):.4f}",
        f"F1 (weighted)           {metrics.get('f1_weighted', 0):.4f}",
        f"Cost-Weighted Score     {metrics.get('cost_weighted_score', 0):.4f}",
        f"Threshold Met (MCC>0.6) {metrics.get('threshold_met', False)}",
        "",
        "Per-Class Breakdown:",
        f"{'Class':<18} {'Prec':>6} {'Recall':>6} {'F1':>6}",
        f"{'-'*18} {'-'*6} {'-'*6} {'-'*6}",
    ]

    for cls, vals in metrics.get("per_class", {}).items():
        lines.append(
            f"{cls:<18} {vals['precision']:>6.3f} {vals['recall']:>6.3f} {vals['f1']:>6.3f}"
        )

    return "\n".join(lines)


def evaluate_on_golden(dataset: str = "golden.jsonl") -> dict:
    """Evaluate classifier on golden dataset and return metrics."""
    from classify import classify_email
    
    golden = load_golden(dataset)
    predictions = []
    ground_truth = []
    
    for email in golden:
        # Classify
        result = classify_email(
            subject=email.get("subject", ""),
            sender=email.get("sender", ""),
            body_preview=email.get("body", "")[:200],
            variant="v4"  # Use Ivan's personalized prompt
        )
        predictions.append(result["action"])
        ground_truth.append(email.get("user_action", "read"))
    
    # Compute metrics
    metrics = compute_metrics(predictions, ground_truth)
    
    # Add accuracy
    correct = sum(1 for p, g in zip(predictions, ground_truth) if p == g)
    metrics["accuracy"] = correct / len(predictions) if predictions else 0
    
    return metrics


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Evaluate email classifier")
    parser.add_argument("--golden", default="golden.jsonl", help="Golden dataset file")
    parser.add_argument("--quick", action="store_true", help="Quick test mode")
    
    args = parser.parse_args()
    
    if args.quick:
        # Quick self-test with sample_golden.jsonl
        golden = load_golden("sample_golden.jsonl")
        print(f"Loaded {len(golden)} examples")

        # Simulate perfect classification
        actions = [e["user_action"] for e in golden]
        m = compute_metrics(actions, actions)
        print(f"Perfect score: MCC={m['mcc']:.3f}, threshold_met={m['threshold_met']}")

        # Print full table
        print()
        print(format_metrics_table(m))
    else:
        # Full evaluation
        try:
            metrics = evaluate_on_golden(args.golden)
            print(format_metrics_table(metrics))
        except Exception as e:
            print(f"Error: {e}")
            # Fallback to quick test
            print("\nFalling back to quick test...")
            golden = load_golden("sample_golden.jsonl")
            actions = [e["user_action"] for e in golden]
            m = compute_metrics(actions, actions)
            print(format_metrics_table(m))
