[Skip to content](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md) to refresh your session.Dismiss alert

{{ message }}

[badlogic](https://github.com/badlogic)/ **[pi-mono](https://github.com/badlogic/pi-mono)** Public

- [Notifications](https://github.com/login?return_to=%2Fbadlogic%2Fpi-mono) You must be signed in to change notification settings
- [Fork\\
3k](https://github.com/login?return_to=%2Fbadlogic%2Fpi-mono)
- [Star\\
28.6k](https://github.com/login?return_to=%2Fbadlogic%2Fpi-mono)


## Collapse file tree

## Files

main

Search this repository(forward slash)` forward slash/`

/

# skills.md

Copy path

BlameMore file actions

BlameMore file actions

## Latest commit

[![badlogic](https://avatars.githubusercontent.com/u/514052?v=4&size=40)](https://github.com/badlogic)[badlogic](https://github.com/badlogic/pi-mono/commits?author=badlogic)

[fix(coding-agent): tighten skill discovery and edit diffs](https://github.com/badlogic/pi-mono/commit/a0734bd162bd9e69c1cd567899934110315862c5) [closes](https://github.com/badlogic/pi-mono/commit/a0734bd162bd9e69c1cd567899934110315862c5) [#2603](https://github.com/badlogic/pi-mono/issues/2603)

failure

yesterdayMar 26, 2026

[a0734bd](https://github.com/badlogic/pi-mono/commit/a0734bd162bd9e69c1cd567899934110315862c5) · yesterdayMar 26, 2026

## History

[History](https://github.com/badlogic/pi-mono/commits/main/packages/coding-agent/docs/skills.md)

Open commit details

[View commit history for this file.](https://github.com/badlogic/pi-mono/commits/main/packages/coding-agent/docs/skills.md) History

232 lines (167 loc) · 6.31 KB

/

# skills.md

Top

## File metadata and controls

- Preview

- Code

- Blame


232 lines (167 loc) · 6.31 KB

[Raw](https://github.com/badlogic/pi-mono/raw/refs/heads/main/packages/coding-agent/docs/skills.md)

Copy raw file

Download raw file

Outline

Edit and raw actions

> pi can create skills. Ask it to build one for your use case.

# Skills

[Permalink: Skills](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#skills)

Skills are self-contained capability packages that the agent loads on-demand. A skill provides specialized workflows, setup instructions, helper scripts, and reference documentation for specific tasks.

Pi implements the [Agent Skills standard](https://agentskills.io/specification), warning about violations but remaining lenient.

## Table of Contents

[Permalink: Table of Contents](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#table-of-contents)

- [Locations](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#locations)
- [How Skills Work](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#how-skills-work)
- [Skill Commands](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#skill-commands)
- [Skill Structure](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#skill-structure)
- [Frontmatter](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#frontmatter)
- [Validation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#validation)
- [Example](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#example)
- [Skill Repositories](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#skill-repositories)

## Locations

[Permalink: Locations](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#locations)

> **Security:** Skills can instruct the model to perform any action and may include executable code the model invokes. Review skill content before use.

Pi loads skills from:

- Global:
  - `~/.pi/agent/skills/`
  - `~/.agents/skills/`
- Project:
  - `.pi/skills/`
  - `.agents/skills/` in `cwd` and ancestor directories (up to git repo root, or filesystem root when not in a repo)
- Packages: `skills/` directories or `pi.skills` entries in `package.json`
- Settings: `skills` array with files or directories
- CLI: `--skill <path>` (repeatable, additive even with `--no-skills`)

Discovery rules:

- In `~/.pi/agent/skills/` and `.pi/skills/`, direct root `.md` files are discovered as individual skills
- In all skill locations, directories containing `SKILL.md` are discovered recursively
- In `~/.agents/skills/` and project `.agents/skills/`, root `.md` files are ignored

Disable discovery with `--no-skills` (explicit `--skill` paths still load).

### Using Skills from Other Harnesses

[Permalink: Using Skills from Other Harnesses](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#using-skills-from-other-harnesses)

To use skills from Claude Code or OpenAI Codex, add their directories to settings:

```
{
  "skills": [\
    "~/.claude/skills",\
    "~/.codex/skills"\
  ]
}
```

For project-level Claude Code skills, add to `.pi/settings.json`:

```
{
  "skills": ["../.claude/skills"]
}
```

## How Skills Work

[Permalink: How Skills Work](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#how-skills-work)

1. At startup, pi scans skill locations and extracts names and descriptions
2. The system prompt includes available skills in XML format per the [specification](https://agentskills.io/integrate-skills)
3. When a task matches, the agent uses `read` to load the full SKILL.md (models don't always do this; use prompting or `/skill:name` to force it)
4. The agent follows the instructions, using relative paths to reference scripts and assets

This is progressive disclosure: only descriptions are always in context, full instructions load on-demand.

## Skill Commands

[Permalink: Skill Commands](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#skill-commands)

Skills register as `/skill:name` commands:

```
/skill:brave-search           # Load and execute the skill
/skill:pdf-tools extract      # Load skill with arguments
```

Arguments after the command are appended to the skill content as `User: <args>`.

Toggle skill commands via `/settings` in interactive mode or in `settings.json`:

```
{
  "enableSkillCommands": true
}
```

## Skill Structure

[Permalink: Skill Structure](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#skill-structure)

A skill is a directory with a `SKILL.md` file. Everything else is freeform.

```
my-skill/
├── SKILL.md              # Required: frontmatter + instructions
├── scripts/              # Helper scripts
│   └── process.sh
├── references/           # Detailed docs loaded on-demand
│   └── api-reference.md
└── assets/
    └── template.json
```

### SKILL.md Format

[Permalink: SKILL.md Format](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#skillmd-format)

```
---
name: my-skill
description: What this skill does and when to use it. Be specific.
---

# My Skill

## Setup

Run once before first use:
\`\`\`bash
cd /path/to/skill && npm install
\`\`\`

## Usage

\`\`\`bash
./scripts/process.sh <input>
\`\`\`
```

Use relative paths from the skill directory:

```
See [the reference guide](references/REFERENCE.md) for details.
```

## Frontmatter

[Permalink: Frontmatter](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#frontmatter)

Per the [Agent Skills specification](https://agentskills.io/specification#frontmatter-required):

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Max 64 chars. Lowercase a-z, 0-9, hyphens. Must match parent directory. |
| `description` | Yes | Max 1024 chars. What the skill does and when to use it. |
| `license` | No | License name or reference to bundled file. |
| `compatibility` | No | Max 500 chars. Environment requirements. |
| `metadata` | No | Arbitrary key-value mapping. |
| `allowed-tools` | No | Space-delimited list of pre-approved tools (experimental). |
| `disable-model-invocation` | No | When `true`, skill is hidden from system prompt. Users must use `/skill:name`. |

### Name Rules

[Permalink: Name Rules](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#name-rules)

- 1-64 characters
- Lowercase letters, numbers, hyphens only
- No leading/trailing hyphens
- No consecutive hyphens
- Must match parent directory name

Valid: `pdf-processing`, `data-analysis`, `code-review`
Invalid: `PDF-Processing`, `-pdf`, `pdf--processing`

### Description Best Practices

[Permalink: Description Best Practices](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#description-best-practices)

The description determines when the agent loads the skill. Be specific.

Good:

```
description: Extracts text and tables from PDF files, fills PDF forms, and merges multiple PDFs. Use when working with PDF documents.
```

Poor:

```
description: Helps with PDFs.
```

## Validation

[Permalink: Validation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#validation)

Pi validates skills against the Agent Skills standard. Most issues produce warnings but still load the skill:

- Name doesn't match parent directory
- Name exceeds 64 characters or contains invalid characters
- Name starts/ends with hyphen or has consecutive hyphens
- Description exceeds 1024 characters

Unknown frontmatter fields are ignored.

**Exception:** Skills with missing description are not loaded.

Name collisions (same name from different locations) warn and keep the first skill found.

## Example

[Permalink: Example](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#example)

```
brave-search/
├── SKILL.md
├── search.js
└── content.js
```

**SKILL.md:**

```
---
name: brave-search
description: Web search and content extraction via Brave Search API. Use for searching documentation, facts, or any web content.
---

# Brave Search

## Setup

\`\`\`bash
cd /path/to/brave-search && npm install
\`\`\`

## Search

\`\`\`bash
./search.js "query"              # Basic search
./search.js "query" --content    # Include page content
\`\`\`

## Extract Page Content

\`\`\`bash
./content.js https://example.com
\`\`\`
```

## Skill Repositories

[Permalink: Skill Repositories](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md#skill-repositories)

- [Anthropic Skills](https://github.com/anthropics/skills) \- Document processing (docx, pdf, pptx, xlsx), web development
- [Pi Skills](https://github.com/badlogic/pi-skills) \- Web search, browser automation, Google APIs, transcription

You can’t perform that action at this time.