#!/usr/bin/env python3

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs"
OUTLINE_PATH = DOCS_DIR / "plans" / "14-day-outline.md"
JOURNAL_DIR = DOCS_DIR / "journal"
OUTPUT_PATH = DOCS_DIR / "data" / "site-index.json"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_outline() -> tuple[list[dict], list[str]]:
    text = read_text(OUTLINE_PATH)
    topics: list[dict] = []
    rules: list[str] = []
    in_rules = False

    for raw_line in text.splitlines():
        line = raw_line.strip()
        topic_match = re.match(r"(\d+)\.\s+Day\s+(\d+)\s+-\s+(.+)", line)
        if topic_match:
            topics.append(
                {
                    "index": int(topic_match.group(1)),
                    "day": int(topic_match.group(2)),
                    "title": topic_match.group(3).strip(),
                }
            )
            continue

        if line == "## Completion Rule":
            in_rules = True
            continue

        if in_rules and line.startswith("- "):
            rules.append(line[2:].strip())

    return topics, rules


def find_section(markdown: str, heading: str) -> list[str]:
    lines = markdown.splitlines()
    collected: list[str] = []
    active = False

    for raw_line in lines:
        line = raw_line.rstrip()
        if line.startswith("## "):
            if active:
                break
            active = line == f"## {heading}"
            continue
        if active:
            collected.append(line)

    return collected


def extract_first_list_item(lines: list[str]) -> str | None:
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("- "):
            return stripped[2:].strip()
    return None


def extract_status(markdown: str) -> str:
    status_lines = find_section(markdown, "Status")
    status = extract_first_list_item(status_lines)
    if not status:
        return "unknown"
    return status.strip("` ").lower()


def extract_summary(markdown: str) -> str:
    goal_lines = find_section(markdown, "Goal")
    summary = extract_first_list_item(goal_lines)
    if summary:
        return summary

    for line in markdown.splitlines():
        stripped = line.strip()
        if stripped and not stripped.startswith("#"):
            return stripped
    return ""


def extract_title(markdown: str, fallback: str) -> str:
    for line in markdown.splitlines():
        stripped = line.strip()
        if stripped.startswith("# "):
            return stripped[2:].strip()
    return fallback


def extract_day_number(path: Path, title: str) -> int | None:
    match = re.search(r"day-(\d+)", path.name)
    if match:
        return int(match.group(1))

    title_match = re.search(r"Day\s+(\d+)", title, flags=re.IGNORECASE)
    if title_match:
        return int(title_match.group(1))

    return None


def parse_journal() -> list[dict]:
    items: list[dict] = []

    for path in sorted(JOURNAL_DIR.glob("*.md")):
        markdown = read_text(path)
        title = extract_title(markdown, path.stem)
        items.append(
            {
                "title": title,
                "file": path.relative_to(DOCS_DIR).as_posix(),
                "day": extract_day_number(path, title),
                "status": extract_status(markdown),
                "summary": extract_summary(markdown),
            }
        )

    return sorted(items, key=lambda item: (item["day"] is None, item["day"] or 999, item["file"]))


def build_payload() -> dict:
    topics, rules = parse_outline()
    journal = parse_journal()
    journal_by_day = {
        entry["day"]: entry
        for entry in journal
        if entry.get("day") is not None
    }

    days = []
    for topic in topics:
        entry = journal_by_day.get(topic["day"])
        days.append(
            {
                **topic,
                "status": entry["status"] if entry else "locked",
                "journalFile": entry["file"] if entry else None,
                "journalTitle": entry["title"] if entry else None,
                "summary": entry["summary"] if entry else "",
            }
        )

    return {
        "siteTitle": "UI/UED Coach",
        "outlineFile": OUTLINE_PATH.relative_to(DOCS_DIR).as_posix(),
        "completionRules": rules,
        "days": days,
        "journal": journal,
    }


def main() -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(build_payload(), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Generated {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

