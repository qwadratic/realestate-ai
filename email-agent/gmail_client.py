#!/usr/bin/env python3
"""Gmail client CLI — fetch emails for the triage agent.

Usage:
    python3 gmail_client.py fetch-unread [--limit N]
    python3 gmail_client.py fetch-body <message_id>
"""

import argparse
import json
import sys
from pathlib import Path

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

TOKEN_FILE = Path(__file__).parent / "token.json"


def get_service():
    with open(TOKEN_FILE) as f:
        token_data = json.load(f)
    creds = Credentials.from_authorized_user_info(token_data)
    return build("gmail", "v1", credentials=creds)


def fetch_unread(limit: int = 20):
    """Fetch unread inbox emails as JSON array."""
    service = get_service()
    results = service.users().messages().list(
        userId="me", labelIds=["INBOX", "UNREAD"], maxResults=limit
    ).execute()
    messages = results.get("messages", [])

    emails = []
    for msg in messages:
        full = service.users().messages().get(
            userId="me", id=msg["id"], format="metadata",
            metadataHeaders=["Subject", "From", "Date"]
        ).execute()
        headers = {h["name"]: h["value"] for h in full["payload"]["headers"]}
        emails.append({
            "id": msg["id"],
            "subject": headers.get("Subject", "(no subject)"),
            "sender": headers.get("From", "unknown"),
            "date": headers.get("Date", ""),
            "snippet": full.get("snippet", "")[:300],
            "labels": full.get("labelIds", []),
        })

    json.dump(emails, sys.stdout, ensure_ascii=False, indent=2)


def fetch_body(message_id: str):
    """Fetch full email body as plain text."""
    import base64
    service = get_service()
    msg = service.users().messages().get(
        userId="me", id=message_id, format="full"
    ).execute()

    # Extract plain text body
    def extract_text(payload):
        if payload.get("mimeType") == "text/plain" and payload.get("body", {}).get("data"):
            return base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="replace")
        for part in payload.get("parts", []):
            text = extract_text(part)
            if text:
                return text
        return ""

    body = extract_text(msg["payload"])
    if not body:
        body = msg.get("snippet", "")

    print(body[:3000])  # Cap at 3000 chars for summarize


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gmail client for email triage agent")
    sub = parser.add_subparsers(dest="command")

    fetch_cmd = sub.add_parser("fetch-unread", help="Fetch unread inbox emails")
    fetch_cmd.add_argument("--limit", type=int, default=20)

    body_cmd = sub.add_parser("fetch-body", help="Fetch full email body")
    body_cmd.add_argument("message_id")

    args = parser.parse_args()
    if args.command == "fetch-unread":
        fetch_unread(args.limit)
    elif args.command == "fetch-body":
        fetch_body(args.message_id)
    else:
        parser.print_help()
