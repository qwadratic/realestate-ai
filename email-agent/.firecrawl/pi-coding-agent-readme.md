[Skip to content](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) to refresh your session.Dismiss alert

{{ message }}

[badlogic](https://github.com/badlogic)/ **[pi-mono](https://github.com/badlogic/pi-mono)** Public

- [Notifications](https://github.com/login?return_to=%2Fbadlogic%2Fpi-mono) You must be signed in to change notification settings
- [Fork\\
3k](https://github.com/login?return_to=%2Fbadlogic%2Fpi-mono)
- [Star\\
28.3k](https://github.com/login?return_to=%2Fbadlogic%2Fpi-mono)


## Collapse file tree

## Files

main

Search this repository(forward slash)` forward slash/`

/

# README.md

Copy path

BlameMore file actions

BlameMore file actions

## Latest commit

[![badlogic](https://avatars.githubusercontent.com/u/514052?v=4&size=40)](https://github.com/badlogic)[badlogic](https://github.com/badlogic/pi-mono/commits?author=badlogic)

[docs: enable OSS weekend](https://github.com/badlogic/pi-mono/commit/72a8fcca93fcc3b37390d9a5b3ff02b6088c1c86)

failure

6 hours agoMar 26, 2026

[72a8fcc](https://github.com/badlogic/pi-mono/commit/72a8fcca93fcc3b37390d9a5b3ff02b6088c1c86) · 6 hours agoMar 26, 2026

## History

[History](https://github.com/badlogic/pi-mono/commits/main/packages/coding-agent/README.md)

Open commit details

[View commit history for this file.](https://github.com/badlogic/pi-mono/commits/main/packages/coding-agent/README.md) History

596 lines (427 loc) · 22.4 KB

/

# README.md

Top

## File metadata and controls

- Preview

- Code

- Blame


596 lines (427 loc) · 22.4 KB

[Raw](https://github.com/badlogic/pi-mono/raw/refs/heads/main/packages/coding-agent/README.md)

Copy raw file

Download raw file

Outline

Edit and raw actions

# 🏖️ OSS Weekend

[Permalink: 🏖️ OSS Weekend](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#%EF%B8%8F-oss-weekend)

**Issue tracker reopens Monday, April 6, 2026.**

OSS weekend runs Friday, March 27, 2026 through Monday, April 6, 2026. New issues are auto-closed during this time. For support, join [Discord](https://discord.com/invite/3cU7Bz4UPx).

* * *

[![pi logo](https://camo.githubusercontent.com/8b5a446dcbd5bea234898b8584e5484099dc0a939d8e59e542b7f5f23b259217/68747470733a2f2f736869747479636f64696e676167656e742e61692f6c6f676f2e737667)](https://shittycodingagent.ai/)

[![Discord](https://camo.githubusercontent.com/953294acc08eb8150a8cafc213631144bebb20fea7bd4e407ef813d6c121dfd8/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f646973636f72642d636f6d6d756e6974792d3538363546323f7374796c653d666c61742d737175617265266c6f676f3d646973636f7264266c6f676f436f6c6f723d7768697465)](https://discord.com/invite/3cU7Bz4UPx)[![npm](https://camo.githubusercontent.com/61951e75dc98d0b019d4cadbccfc8e19eb6d70d3edcca83afb46d250b7323950/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f406d6172696f7a6563686e65722f70692d636f64696e672d6167656e743f7374796c653d666c61742d737175617265)](https://www.npmjs.com/package/@mariozechner/pi-coding-agent)[![Build status](https://camo.githubusercontent.com/56abc7c4f932466ac09d8adafcac16f558e5ffd52989432b9d6d2d153de56374/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f616374696f6e732f776f726b666c6f772f7374617475732f6261646c6f6769632f70692d6d6f6e6f2f63692e796d6c3f7374796c653d666c61742d737175617265266272616e63683d6d61696e)](https://github.com/badlogic/pi-mono/actions/workflows/ci.yml)

[pi.dev](https://pi.dev/) domain graciously donated by


[![Exy mascot](https://github.com/badlogic/pi-mono/raw/main/packages/coding-agent/docs/images/exy.png)\\
\\
exe.dev](https://exe.dev/)

Pi is a minimal terminal coding harness. Adapt pi to your workflows, not the other way around, without having to fork and modify pi internals. Extend it with TypeScript [Extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#extensions), [Skills](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#skills), [Prompt Templates](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#prompt-templates), and [Themes](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#themes). Put your extensions, skills, prompt templates, and themes in [Pi Packages](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#pi-packages) and share them with others via npm or git.

Pi ships with powerful defaults but skips features like sub agents and plan mode. Instead, you can ask pi to build what you want or install a third party pi package that matches your workflow.

Pi runs in four modes: interactive, print or JSON, RPC for process integration, and an SDK for embedding in your own apps. See [openclaw/openclaw](https://github.com/openclaw/openclaw) for a real-world SDK integration.

## Table of Contents

[Permalink: Table of Contents](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#table-of-contents)

- [Quick Start](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#quick-start)
- [Providers & Models](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#providers--models)
- [Interactive Mode](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#interactive-mode)
  - [Editor](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#editor)
  - [Commands](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#commands)
  - [Keyboard Shortcuts](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#keyboard-shortcuts)
  - [Message Queue](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#message-queue)
- [Sessions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#sessions)
  - [Branching](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#branching)
  - [Compaction](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#compaction)
- [Settings](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#settings)
- [Context Files](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#context-files)
- [Customization](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#customization)
  - [Prompt Templates](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#prompt-templates)
  - [Skills](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#skills)
  - [Extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#extensions)
  - [Themes](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#themes)
  - [Pi Packages](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#pi-packages)
- [Programmatic Usage](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#programmatic-usage)
- [Philosophy](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#philosophy)
- [CLI Reference](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#cli-reference)

* * *

## Quick Start

[Permalink: Quick Start](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#quick-start)

```
npm install -g @mariozechner/pi-coding-agent
```

Authenticate with an API key:

```
export ANTHROPIC_API_KEY=sk-ant-...
pi
```

Or use your existing subscription:

```
pi
/login  # Then select provider
```

Then just talk to pi. By default, pi gives the model four tools: `read`, `write`, `edit`, and `bash`. The model uses these to fulfill your requests. Add capabilities via [skills](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#skills), [prompt templates](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#prompt-templates), [extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#extensions), or [pi packages](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#pi-packages).

**Platform notes:** [Windows](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/windows.md) \| [Termux (Android)](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/termux.md) \| [tmux](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/tmux.md) \| [Terminal setup](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/terminal-setup.md) \| [Shell aliases](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/shell-aliases.md)

* * *

## Providers & Models

[Permalink: Providers & Models](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#providers--models)

For each built-in provider, pi maintains a list of tool-capable models, updated with every release. Authenticate via subscription (`/login`) or API key, then select any model from that provider via `/model` (or Ctrl+L).

**Subscriptions:**

- Anthropic Claude Pro/Max
- OpenAI ChatGPT Plus/Pro (Codex)
- GitHub Copilot
- Google Gemini CLI
- Google Antigravity

**API keys:**

- Anthropic
- OpenAI
- Azure OpenAI
- Google Gemini
- Google Vertex
- Amazon Bedrock
- Mistral
- Groq
- Cerebras
- xAI
- OpenRouter
- Vercel AI Gateway
- ZAI
- OpenCode Zen
- OpenCode Go
- Hugging Face
- Kimi For Coding
- MiniMax

See [docs/providers.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/providers.md) for detailed setup instructions.

**Custom providers & models:** Add providers via `~/.pi/agent/models.json` if they speak a supported API (OpenAI, Anthropic, Google). For custom APIs or OAuth, use extensions. See [docs/models.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/models.md) and [docs/custom-provider.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/custom-provider.md).

* * *

## Interactive Mode

[Permalink: Interactive Mode](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#interactive-mode)

[![Interactive Mode](https://github.com/badlogic/pi-mono/raw/main/packages/coding-agent/docs/images/interactive-mode.png)](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/images/interactive-mode.png)

The interface from top to bottom:

- **Startup header** \- Shows shortcuts (`/hotkeys` for all), loaded AGENTS.md files, prompt templates, skills, and extensions
- **Messages** \- Your messages, assistant responses, tool calls and results, notifications, errors, and extension UI
- **Editor** \- Where you type; border color indicates thinking level
- **Footer** \- Working directory, session name, total token/cache usage, cost, context usage, current model

The editor can be temporarily replaced by other UI, like built-in `/settings` or custom UI from extensions (e.g., a Q&A tool that lets the user answer model questions in a structured format). [Extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#extensions) can also replace the editor, add widgets above/below it, a status line, custom footer, or overlays.

### Editor

[Permalink: Editor](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#editor)

| Feature | How |
| --- | --- |
| File reference | Type `@` to fuzzy-search project files |
| Path completion | Tab to complete paths |
| Multi-line | Shift+Enter (or Ctrl+Enter on Windows Terminal) |
| Images | Ctrl+V to paste (Alt+V on Windows), or drag onto terminal |
| Bash commands | `!command` runs and sends output to LLM, `!!command` runs without sending |

Standard editing keybindings for delete word, undo, etc. See [docs/keybindings.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/keybindings.md).

### Commands

[Permalink: Commands](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#commands)

Type `/` in the editor to trigger commands. [Extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#extensions) can register custom commands, [skills](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#skills) are available as `/skill:name`, and [prompt templates](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#prompt-templates) expand via `/templatename`.

| Command | Description |
| --- | --- |
| `/login`, `/logout` | OAuth authentication |
| `/model` | Switch models |
| `/scoped-models` | Enable/disable models for Ctrl+P cycling |
| `/settings` | Thinking level, theme, message delivery, transport |
| `/resume` | Pick from previous sessions |
| `/new` | Start a new session |
| `/name <name>` | Set session display name |
| `/session` | Show session info (path, tokens, cost) |
| `/tree` | Jump to any point in the session and continue from there |
| `/fork` | Create a new session from the current branch |
| `/compact [prompt]` | Manually compact context, optional custom instructions |
| `/copy` | Copy last assistant message to clipboard |
| `/export [file]` | Export session to HTML file |
| `/share` | Upload as private GitHub gist with shareable HTML link |
| `/reload` | Reload keybindings, extensions, skills, prompts, and context files (themes hot-reload automatically) |
| `/hotkeys` | Show all keyboard shortcuts |
| `/changelog` | Display version history |
| `/quit`, `/exit` | Quit pi |

### Keyboard Shortcuts

[Permalink: Keyboard Shortcuts](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#keyboard-shortcuts)

See `/hotkeys` for the full list. Customize via `~/.pi/agent/keybindings.json`. See [docs/keybindings.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/keybindings.md).

**Commonly used:**

| Key | Action |
| --- | --- |
| Ctrl+C | Clear editor |
| Ctrl+C twice | Quit |
| Escape | Cancel/abort |
| Escape twice | Open `/tree` |
| Ctrl+L | Open model selector |
| Ctrl+P / Shift+Ctrl+P | Cycle scoped models forward/backward |
| Shift+Tab | Cycle thinking level |
| Ctrl+O | Collapse/expand tool output |
| Ctrl+T | Collapse/expand thinking blocks |

### Message Queue

[Permalink: Message Queue](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#message-queue)

Submit messages while the agent is working:

- **Enter** queues a _steering_ message, delivered after the current assistant turn finishes executing its tool calls
- **Alt+Enter** queues a _follow-up_ message, delivered only after the agent finishes all work
- **Escape** aborts and restores queued messages to editor
- **Alt+Up** retrieves queued messages back to editor

On Windows Terminal, `Alt+Enter` is fullscreen by default. Remap it in [docs/terminal-setup.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/terminal-setup.md) so pi can receive the follow-up shortcut.

Configure delivery in [settings](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/settings.md): `steeringMode` and `followUpMode` can be `"one-at-a-time"` (default, waits for response) or `"all"` (delivers all queued at once). `transport` selects provider transport preference (`"sse"`, `"websocket"`, or `"auto"`) for providers that support multiple transports.

* * *

## Sessions

[Permalink: Sessions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#sessions)

Sessions are stored as JSONL files with a tree structure. Each entry has an `id` and `parentId`, enabling in-place branching without creating new files. See [docs/session.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/session.md) for file format.

### Management

[Permalink: Management](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#management)

Sessions auto-save to `~/.pi/agent/sessions/` organized by working directory.

```
pi -c                  # Continue most recent session
pi -r                  # Browse and select from past sessions
pi --no-session        # Ephemeral mode (don't save)
pi --session <path>    # Use specific session file or ID
pi --fork <path>       # Fork specific session file or ID into a new session
```

### Branching

[Permalink: Branching](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#branching)

**`/tree`** \- Navigate the session tree in-place. Select any previous point, continue from there, and switch between branches. All history preserved in a single file.

[![Tree View](https://github.com/badlogic/pi-mono/raw/main/packages/coding-agent/docs/images/tree-view.png)](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/images/tree-view.png)

- Search by typing, fold/unfold and jump between branches with Ctrl+←/Ctrl+→ or Alt+←/Alt+→, page with ←/→
- Filter modes (Ctrl+O): default → no-tools → user-only → labeled-only → all
- Press `l` to label entries as bookmarks

**`/fork`** \- Create a new session file from the current branch. Opens a selector, copies history up to the selected point, and places that message in the editor for modification.

**`--fork <path|id>`** \- Fork an existing session file or partial session UUID directly from the CLI. This copies the full source session into a new session file in the current project.

### Compaction

[Permalink: Compaction](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#compaction)

Long sessions can exhaust context windows. Compaction summarizes older messages while keeping recent ones.

**Manual:**`/compact` or `/compact <custom instructions>`

**Automatic:** Enabled by default. Triggers on context overflow (recovers and retries) or when approaching the limit (proactive). Configure via `/settings` or `settings.json`.

Compaction is lossy. The full history remains in the JSONL file; use `/tree` to revisit. Customize compaction behavior via [extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#extensions). See [docs/compaction.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/compaction.md) for internals.

* * *

## Settings

[Permalink: Settings](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#settings)

Use `/settings` to modify common options, or edit JSON files directly:

| Location | Scope |
| --- | --- |
| `~/.pi/agent/settings.json` | Global (all projects) |
| `.pi/settings.json` | Project (overrides global) |

See [docs/settings.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/settings.md) for all options.

* * *

## Context Files

[Permalink: Context Files](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#context-files)

Pi loads `AGENTS.md` (or `CLAUDE.md`) at startup from:

- `~/.pi/agent/AGENTS.md` (global)
- Parent directories (walking up from cwd)
- Current directory

Use for project instructions, conventions, common commands. All matching files are concatenated.

### System Prompt

[Permalink: System Prompt](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#system-prompt)

Replace the default system prompt with `.pi/SYSTEM.md` (project) or `~/.pi/agent/SYSTEM.md` (global). Append without replacing via `APPEND_SYSTEM.md`.

* * *

## Customization

[Permalink: Customization](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#customization)

### Prompt Templates

[Permalink: Prompt Templates](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#prompt-templates)

Reusable prompts as Markdown files. Type `/name` to expand.

```
<!-- ~/.pi/agent/prompts/review.md -->
Review this code for bugs, security issues, and performance problems.
Focus on: {{focus}}
```

Place in `~/.pi/agent/prompts/`, `.pi/prompts/`, or a [pi package](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#pi-packages) to share with others. See [docs/prompt-templates.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/prompt-templates.md).

### Skills

[Permalink: Skills](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#skills)

On-demand capability packages following the [Agent Skills standard](https://agentskills.io/). Invoke via `/skill:name` or let the agent load them automatically.

```
<!-- ~/.pi/agent/skills/my-skill/SKILL.md -->
# My Skill
Use this skill when the user asks about X.

## Steps
1. Do this
2. Then that
```

Place in `~/.pi/agent/skills/`, `~/.agents/skills/`, `.pi/skills/`, or `.agents/skills/` (from `cwd` up through parent directories) or a [pi package](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#pi-packages) to share with others. See [docs/skills.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md).

### Extensions

[Permalink: Extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#extensions)

[![Doom Extension](https://github.com/badlogic/pi-mono/raw/main/packages/coding-agent/docs/images/doom-extension.png)](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/images/doom-extension.png)

TypeScript modules that extend pi with custom tools, commands, keyboard shortcuts, event handlers, and UI components.

```
export default function (pi: ExtensionAPI) {
  pi.registerTool({ name: "deploy", ... });
  pi.registerCommand("stats", { ... });
  pi.on("tool_call", async (event, ctx) => { ... });
}
```

**What's possible:**

- Custom tools (or replace built-in tools entirely)
- Sub-agents and plan mode
- Custom compaction and summarization
- Permission gates and path protection
- Custom editors and UI components
- Status lines, headers, footers
- Git checkpointing and auto-commit
- SSH and sandbox execution
- MCP server integration
- Make pi look like Claude Code
- Games while waiting (yes, Doom runs)
- ...anything you can dream up

Place in `~/.pi/agent/extensions/`, `.pi/extensions/`, or a [pi package](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#pi-packages) to share with others. See [docs/extensions.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md) and [examples/extensions/](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/examples/extensions).

### Themes

[Permalink: Themes](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#themes)

Built-in: `dark`, `light`. Themes hot-reload: modify the active theme file and pi immediately applies changes.

Place in `~/.pi/agent/themes/`, `.pi/themes/`, or a [pi package](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#pi-packages) to share with others. See [docs/themes.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/themes.md).

### Pi Packages

[Permalink: Pi Packages](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#pi-packages)

Bundle and share extensions, skills, prompts, and themes via npm or git. Find packages on [npmjs.com](https://www.npmjs.com/search?q=keywords%3Api-package) or [Discord](https://discord.com/channels/1456806362351669492/1457744485428629628).

> **Security:** Pi packages run with full system access. Extensions execute arbitrary code, and skills can instruct the model to perform any action including running executables. Review source code before installing third-party packages.

```
pi install npm:@foo/pi-tools
pi install npm:@foo/pi-tools@1.2.3      # pinned version
pi install git:github.com/user/repo
pi install git:github.com/user/repo@v1  # tag or commit
pi install git:git@github.com:user/repo
pi install git:git@github.com:user/repo@v1  # tag or commit
pi install https://github.com/user/repo
pi install https://github.com/user/repo@v1      # tag or commit
pi install ssh://git@github.com/user/repo
pi install ssh://git@github.com/user/repo@v1    # tag or commit
pi remove npm:@foo/pi-tools
pi uninstall npm:@foo/pi-tools          # alias for remove
pi list
pi update                               # skips pinned packages
pi config                               # enable/disable extensions, skills, prompts, themes
```

Packages install to `~/.pi/agent/git/` (git) or global npm. Use `-l` for project-local installs (`.pi/git/`, `.pi/npm/`). If you use a Node version manager and want package installs to reuse a stable npm context, set `npmCommand` in `settings.json`, for example `["mise", "exec", "node@20", "--", "npm"]`.

Create a package by adding a `pi` key to `package.json`:

```
{
  "name": "my-pi-package",
  "keywords": ["pi-package"],
  "pi": {
    "extensions": ["./extensions"],
    "skills": ["./skills"],
    "prompts": ["./prompts"],
    "themes": ["./themes"]
  }
}
```

Without a `pi` manifest, pi auto-discovers from conventional directories (`extensions/`, `skills/`, `prompts/`, `themes/`).

See [docs/packages.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/packages.md).

* * *

## Programmatic Usage

[Permalink: Programmatic Usage](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#programmatic-usage)

### SDK

[Permalink: SDK](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#sdk)

```
import { AuthStorage, createAgentSession, ModelRegistry, SessionManager } from "@mariozechner/pi-coding-agent";

const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  authStorage: AuthStorage.create(),
  modelRegistry: new ModelRegistry(authStorage),
});

await session.prompt("What files are in the current directory?");
```

See [docs/sdk.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/sdk.md) and [examples/sdk/](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/examples/sdk).

### RPC Mode

[Permalink: RPC Mode](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#rpc-mode)

For non-Node.js integrations, use RPC mode over stdin/stdout:

```
pi --mode rpc
```

RPC mode uses strict LF-delimited JSONL framing. Clients must split records on `\n` only. Do not use generic line readers like Node `readline`, which also split on Unicode separators inside JSON payloads.

See [docs/rpc.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md) for the protocol.

* * *

## Philosophy

[Permalink: Philosophy](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#philosophy)

Pi is aggressively extensible so it doesn't have to dictate your workflow. Features that other tools bake in can be built with [extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#extensions), [skills](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#skills), or installed from third-party [pi packages](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#pi-packages). This keeps the core minimal while letting you shape pi to fit how you work.

**No MCP.** Build CLI tools with READMEs (see [Skills](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#skills)), or build an extension that adds MCP support. [Why?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)

**No sub-agents.** There's many ways to do this. Spawn pi instances via tmux, or build your own with [extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#extensions), or install a package that does it your way.

**No permission popups.** Run in a container, or build your own confirmation flow with [extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#extensions) inline with your environment and security requirements.

**No plan mode.** Write plans to files, or build it with [extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#extensions), or install a package.

**No built-in to-dos.** They confuse models. Use a TODO.md file, or build your own with [extensions](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#extensions).

**No background bash.** Use tmux. Full observability, direct interaction.

Read the [blog post](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) for the full rationale.

* * *

## CLI Reference

[Permalink: CLI Reference](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#cli-reference)

```
pi [options] [@files...] [messages...]
```

### Package Commands

[Permalink: Package Commands](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#package-commands)

```
pi install <source> [-l]     # Install package, -l for project-local
pi remove <source> [-l]      # Remove package
pi uninstall <source> [-l]   # Alias for remove
pi update [source]           # Update packages (skips pinned)
pi list                      # List installed packages
pi config                    # Enable/disable package resources
```

### Modes

[Permalink: Modes](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#modes)

| Flag | Description |
| --- | --- |
| (default) | Interactive mode |
| `-p`, `--print` | Print response and exit |
| `--mode json` | Output all events as JSON lines (see [docs/json.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/json.md)) |
| `--mode rpc` | RPC mode for process integration (see [docs/rpc.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/rpc.md)) |
| `--export <in> [out]` | Export session to HTML |

In print mode, pi also reads piped stdin and merges it into the initial prompt:

```
cat README.md | pi -p "Summarize this text"
```

### Model Options

[Permalink: Model Options](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#model-options)

| Option | Description |
| --- | --- |
| `--provider <name>` | Provider (anthropic, openai, google, etc.) |
| `--model <pattern>` | Model pattern or ID (supports `provider/id` and optional `:<thinking>`) |
| `--api-key <key>` | API key (overrides env vars) |
| `--thinking <level>` | `off`, `minimal`, `low`, `medium`, `high`, `xhigh` |
| `--models <patterns>` | Comma-separated patterns for Ctrl+P cycling |
| `--list-models [search]` | List available models |

### Session Options

[Permalink: Session Options](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#session-options)

| Option | Description |
| --- | --- |
| `-c`, `--continue` | Continue most recent session |
| `-r`, `--resume` | Browse and select session |
| `--session <path>` | Use specific session file or partial UUID |
| `--fork <path>` | Fork specific session file or partial UUID into a new session |
| `--session-dir <dir>` | Custom session storage directory |
| `--no-session` | Ephemeral mode (don't save) |

### Tool Options

[Permalink: Tool Options](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#tool-options)

| Option | Description |
| --- | --- |
| `--tools <list>` | Enable specific built-in tools (default: `read,bash,edit,write`) |
| `--no-tools` | Disable all built-in tools (extension tools still work) |

Available built-in tools: `read`, `bash`, `edit`, `write`, `grep`, `find`, `ls`

### Resource Options

[Permalink: Resource Options](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#resource-options)

| Option | Description |
| --- | --- |
| `-e`, `--extension <source>` | Load extension from path, npm, or git (repeatable) |
| `--no-extensions` | Disable extension discovery |
| `--skill <path>` | Load skill (repeatable) |
| `--no-skills` | Disable skill discovery |
| `--prompt-template <path>` | Load prompt template (repeatable) |
| `--no-prompt-templates` | Disable prompt template discovery |
| `--theme <path>` | Load theme (repeatable) |
| `--no-themes` | Disable theme discovery |

Combine `--no-*` with explicit flags to load exactly what you need, ignoring settings.json (e.g., `--no-extensions -e ./my-ext.ts`).

### Other Options

[Permalink: Other Options](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#other-options)

| Option | Description |
| --- | --- |
| `--system-prompt <text>` | Replace default prompt (context files and skills still appended) |
| `--append-system-prompt <text>` | Append to system prompt |
| `--verbose` | Force verbose startup |
| `-h`, `--help` | Show help |
| `-v`, `--version` | Show version |

### File Arguments

[Permalink: File Arguments](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#file-arguments)

Prefix files with `@` to include in the message:

```
pi @prompt.md "Answer this"
pi -p @screenshot.png "What's in this image?"
pi @code.ts @test.ts "Review these files"
```

### Examples

[Permalink: Examples](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#examples)

```
# Interactive with initial prompt
pi "List all .ts files in src/"

# Non-interactive
pi -p "Summarize this codebase"

# Non-interactive with piped stdin
cat README.md | pi -p "Summarize this text"

# Different model
pi --provider openai --model gpt-4o "Help me refactor"

# Model with provider prefix (no --provider needed)
pi --model openai/gpt-4o "Help me refactor"

# Model with thinking level shorthand
pi --model sonnet:high "Solve this complex problem"

# Limit model cycling
pi --models "claude-*,gpt-4o"

# Read-only mode
pi --tools read,grep,find,ls -p "Review the code"

# High thinking level
pi --thinking high "Solve this complex problem"
```

### Environment Variables

[Permalink: Environment Variables](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#environment-variables)

| Variable | Description |
| --- | --- |
| `PI_CODING_AGENT_DIR` | Override config directory (default: `~/.pi/agent`) |
| `PI_PACKAGE_DIR` | Override package directory (useful for Nix/Guix where store paths tokenize poorly) |
| `PI_SKIP_VERSION_CHECK` | Skip version check at startup |
| `PI_CACHE_RETENTION` | Set to `long` for extended prompt cache (Anthropic: 1h, OpenAI: 24h) |
| `VISUAL`, `EDITOR` | External editor for Ctrl+G |

* * *

## Contributing & Development

[Permalink: Contributing & Development](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#contributing--development)

See [CONTRIBUTING.md](https://github.com/badlogic/pi-mono/blob/main/CONTRIBUTING.md) for guidelines and [docs/development.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/development.md) for setup, forking, and debugging.

* * *

## License

[Permalink: License](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#license)

MIT

## See Also

[Permalink: See Also](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md#see-also)

- [@mariozechner/pi-ai](https://www.npmjs.com/package/@mariozechner/pi-ai): Core LLM toolkit
- [@mariozechner/pi-agent](https://www.npmjs.com/package/@mariozechner/pi-agent): Agent framework
- [@mariozechner/pi-tui](https://www.npmjs.com/package/@mariozechner/pi-tui): Terminal UI components

You can’t perform that action at this time.