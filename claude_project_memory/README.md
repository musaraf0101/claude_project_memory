# Claude Project Memory

> Never lose context across Claude chat resets and computer restarts.

A **100% free, fully local** VSCode extension that auto-captures your project state and generates a smart continuation prompt — so when you hit the Claude 200-message limit or restart your computer, you can resume exactly where you left off without re-explaining anything.

---

## The Problem

```
You're deep in a project with Claude...

Day 1:
├─ Build authentication system (2 hours of work)
├─ Hit Claude's 200-message limit
├─ Open new chat
└─ Claude scans ENTIRE project again (wastes tokens)
   └─ You re-explain everything from scratch

Day 2 (after restart):
├─ Open VSCode
├─ Start new Claude chat
└─ ALL CONTEXT LOST
   ├─ Forgotten: yesterday's architectural decisions
   ├─ Forgotten: what you were building
   └─ You waste 30 minutes explaining again
```

## The Solution

Press one shortcut. Paste in new chat. Continue instantly.

```
Your Workflow:
┌─────────────────────────────────────┐
│ 1. Code normally with Claude        │
│ 2. Extension auto-tracks everything │
├─────────────────────────────────────┤
│ 3. Chat limit hits (or you restart) │
│ 4. Open Command Palette             │
│    → "Claude Memory: Continue in    │
│       New Chat"                     │
│ 5. Paste prompt in new chat         │
├─────────────────────────────────────┤
│ 6. Claude continues seamlessly      │
│    • No project re-scan             │
│    • Full context retained          │
│    • Saves ~98% of wasted tokens    │
└─────────────────────────────────────┘
```

---

## Features

- **Auto context capture** — tracks tech stack, active files, and modifications automatically
- **Persistent storage** — survives VSCode restarts and computer reboots
- **Smart prompt generation** — one command copies a rich continuation prompt to clipboard
- **Progress logging** — manually record completed tasks that appear in every future prompt
- **Decision tracking** — capture architectural choices so Claude never forgets them
- **Memory viewer** — a clean panel showing everything the extension knows about your project
- **Zero config** — activates automatically when you open a workspace
- **100% local** — nothing leaves your machine; no accounts, no subscriptions

---

## Requirements

- [VS Code](https://code.visualstudio.com/) 1.74 or later
- [Node.js](https://nodejs.org/) 18 or later (only needed if building from source)

---

## Installation

### Option A — From the Marketplace _(coming soon)_

1. Open VS Code
2. Press `Ctrl+P`
3. Type `ext install claude-project-memory`
4. Press Enter

### Option B — Manual install (.vsix)

```bash
code --install-extension claude-project-memory-1.0.0.vsix
```

Or install via the VS Code UI:

1. Open VS Code
2. Go to **Extensions** sidebar (`Ctrl+Shift+X`)
3. Click the `···` menu at the top right of the Extensions panel
4. Select **Install from VSIX...**
5. Pick the downloaded `.vsix` file

### Option C — Build from Source (Developers)

```bash
git clone https://github.com/yourusername/claude-project-memory.git
cd claude-project-memory
npm install
npm run compile
```

Then press **F5** in VS Code to launch the Extension Development Host and test it live.

To package into a `.vsix`:

```bash
npx vsce package
```

---

## Verify the Extension is Running

Once installed and a workspace is open, you should see this in the bottom-right status bar:

```
🗄 Claude Memory
```

After saving a file or logging a task it updates to:

```
🗄 Claude Memory (2 tasks, 5 files)
```

If you don't see it, open the Command Palette (`Ctrl+Shift+P`) and search for **Claude Memory** — any command appearing confirms the extension is active.

---

## Usage

### Step 1 — Just code

Open any project. The extension activates automatically and starts tracking in the background.

### Step 2 — Log what you finish _(optional but recommended)_

After completing something meaningful, run:

> **Command Palette → Claude Memory: Save Progress**

Type what you completed, e.g. `Implemented JWT authentication`. This appears in every future continuation prompt.

### Step 3 — Continue in a new chat

When you need to start a fresh Claude chat:

> **Command Palette → Claude Memory: Continue in New Chat**

The prompt is copied to your clipboard. Paste it as the first message in the new chat.

**Example of a generated prompt:**

```
🔄 PROJECT CONTINUATION — Claude Project Memory
====================================================
📁 Project:      my-saas-app
⚡ Stack:        Node.js, Next.js, TypeScript, Prisma, Tailwind CSS
📅 Last Active:  4/25/2026, 11:30:00 AM
🔢 Session:      #7

🎯 CURRENT TASK:
   Building email verification flow

✅ RECENTLY COMPLETED:
   ✓ Implemented JWT authentication
   ✓ Created user registration API
   ✓ Set up Prisma schema with User model

🏛️ KEY DECISIONS MADE:
   • Storing JWT in httpOnly cookies (not localStorage)
   • Refresh token rotation every 7 days
   • Using Resend for transactional email

📝 RECENTLY MODIFIED FILES:
   • src/app/api/auth/login/route.ts (3 saves) — 2h ago
   • src/lib/auth.ts (5 saves) — 3h ago
   • prisma/schema.prisma (2 saves) — 1d ago

====================================================
Context loaded by Claude Project Memory (VSCode extension).
Continue helping — no full project scan needed!
```

---

## Commands

All commands are available via the **Command Palette** (`Ctrl+Shift+P`). Type `Claude Memory` to filter them.

**Keyboard shortcut:** `Ctrl+Shift+Alt+C` (Windows/Linux) · `Cmd+Shift+Alt+C` (Mac)

---

### Continue in New Chat

**Command:** `Claude Memory: Continue in New Chat`  
**Shortcut:** `Ctrl+Shift+Alt+C`

Generates a full context prompt and copies it to your clipboard. Paste it as the first message in a new Claude chat — Claude will continue from exactly where you left off with no re-explaining needed.

**When to use:** Whenever you hit the Claude 200-message limit, start a fresh session, or return after a computer restart.

---

### Save Progress

**Command:** `Claude Memory: Save Progress`

Opens an input box. Type a short description of what you just completed. Stored under **RECENTLY COMPLETED** in every future continuation prompt.

**Examples:**
```
Implemented JWT authentication
Created the user registration API
Fixed the password reset email bug
```

**When to use:** After finishing any meaningful piece of work — before switching tasks, taking a break, or ending the day.

---

### Record Decision

**Command:** `Claude Memory: Record Decision`

Opens an input box. Type an architectural or technical decision you made. Stored under **KEY DECISIONS MADE** in every future prompt.

**Examples:**
```
Using JWT stored in httpOnly cookies, not localStorage
Chose Prisma over raw SQL for type safety
Storing images in S3, serving via CloudFront
```

**When to use:** Any time you make a choice that would be painful to re-explain — auth strategy, database design, third-party services.

---

### Set Current Task

**Command:** `Claude Memory: Set Current Task`

Opens an input box pre-filled with your current task. Update it to describe what you're actively working on. Appears at the top of every continuation prompt under **CURRENT TASK**.

**Examples:**
```
Building the email verification flow
Fixing the signup form validation bug
Writing tests for the payment module
```

**When to use:** At the start of each work session, or whenever you switch to a new task. To clear it, open the command and delete the text before confirming.

---

### View Memory

**Command:** `Claude Memory: View Memory`  
**Status bar:** Click the `🗄 Claude Memory` item in the bottom-right

Opens a panel showing everything the extension has captured:

| Section | What it shows |
|---|---|
| **Tech Stack** | Auto-detected frameworks and libraries |
| **Current Task** | What you set as your active task |
| **Completed Tasks** | Your logged progress entries |
| **Key Decisions** | Your recorded architectural decisions |
| **Recent Files** | Files modified, with timestamps and save counts |

---

### Reset Memory

**Command:** `Claude Memory: Reset Memory`

Shows a confirmation dialog, then clears all saved context for the current project. The `.claude-memory/project-map.json` file is reset to a blank state.

**When to use:** When starting a completely new phase of the project, or if the saved context has become outdated.

> **Note:** This only affects the current workspace. Other projects are not affected.

---

## Storage

Context is saved locally inside your project:

```
your-project/
└── .claude-memory/
    └── project-map.json    ← all context (tech stack, tasks, files, decisions)
```

`project-map.json` is a plain JSON file — you can open and read it at any time.

**To share context with your team:** commit `.claude-memory/` to git.  
**To keep it private:** add this line to your `.gitignore`:

```
.claude-memory/
```

---

## Supported Tech Stacks

Auto-detected from config files in your workspace root:

| File | Detected Stacks |
|---|---|
| `package.json` | Node.js, Next.js, React, Vue, Angular, Svelte, Express, NestJS, Fastify, TypeScript, Prisma, Drizzle, tRPC, Tailwind, GraphQL, Socket.io, Electron, React Native, Jest, Vitest, Zod |
| `requirements.txt` / `pyproject.toml` | Python, Django, Flask, FastAPI, SQLAlchemy, Pandas, NumPy, TensorFlow, PyTorch |
| `go.mod` | Go, Gin, Fiber, Gorilla Mux, GORM |
| `Cargo.toml` | Rust, Actix Web, Axum, Tokio, Diesel |
| `pubspec.yaml` | Flutter/Dart |
| `pom.xml` | Java/Maven, Spring Boot |
| `build.gradle` | Java/Gradle, Kotlin, Android, Spring Boot |
| `composer.json` | PHP, Laravel, Symfony |
| `mix.exs` | Elixir, Phoenix |
| `Gemfile` | Ruby, Ruby on Rails, Sinatra |

---

## Customizing the Keyboard Shortcut

1. Open **File → Preferences → Keyboard Shortcuts** (`Ctrl+K Ctrl+S`)
2. Search for `claudeMemory.continueInNewChat`
3. Click the pencil icon and press your preferred key combination

---

## Uninstalling

**From VS Code UI:**

1. Open the Extensions sidebar (`Ctrl+Shift+X`)
2. Search for **Claude Project Memory**
3. Click **Uninstall**

**From terminal:**

```bash
code --uninstall-extension claude-project-memory.claude-project-memory
```

The `.claude-memory/` folders inside your projects are not removed automatically. Delete them manually if needed.

---

## Privacy

- All data is stored in `.claude-memory/` inside your project folder
- Nothing is sent to any server
- No telemetry, no accounts, no internet connection required

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push and open a pull request

Please open an issue first for larger changes.

---

## Changelog

### [1.0.0] — Initial Release

- Auto context capture: tracks tech stack, recently modified files
- Persistent storage in `.claude-memory/project-map.json`
- Smart continuation prompt generation (Command Palette / keybinding)
- Save Progress command to log completed tasks
- Record Decision command to capture architectural choices
- Set Current Task command
- View Memory webview panel
- Reset Memory command
- Status bar indicator with task/file counts
- First-run welcome message
- Supports 12+ tech stacks: Node.js, Next.js, React, Vue, Angular, Express, NestJS, Python (Django/Flask/FastAPI), Go (Gin/Fiber), Rust (Actix/Axum), Flutter, Java (Maven/Gradle/Spring), PHP (Laravel/Symfony), Ruby (Rails), Elixir (Phoenix)

---

## License

[MIT](LICENSE) — free forever.
