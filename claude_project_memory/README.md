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

## Installation

### From the Marketplace _(coming soon)_

1. Open VS Code
2. Press `Ctrl+P`
3. Type `ext install claude-project-memory`
4. Press Enter

### Manual install (.vsix)

```bash
code --install-extension claude-project-memory-1.0.0.vsix
```

### From source

```bash
git clone https://github.com/yourusername/claude-project-memory.git
cd claude-project-memory
npm install
npm run compile
# Press F5 in VS Code to launch the Extension Development Host
```

---

## Usage

### Step 1 — Just code

Open any project. The extension activates automatically and starts tracking in the background. A status bar item appears in the bottom-right corner:

```
$(database) Claude Memory (3 tasks, 12 files)
```

### Step 2 — Log what you finish _(optional but recommended)_

After completing something meaningful, run:

> **Command Palette → Claude Memory: Save Progress**

Type what you completed, e.g. `Implemented JWT authentication`. This appears in every future continuation prompt.

### Step 3 — Continue in a new chat

When you need to start a fresh Claude chat:

> **Command Palette → Claude Memory: Continue in New Chat**

The prompt is copied to your clipboard. Paste it as the first message in the new chat. Claude will have full context and can continue without any project scan.

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

All commands are available via the Command Palette (`Ctrl+Shift+P`):

| Command                                 | Description                                      |
| --------------------------------------- | ------------------------------------------------ |
| **Claude Memory: Continue in New Chat** | Copies the full continuation prompt to clipboard |
| **Claude Memory: Save Progress**        | Log a task you just completed                    |
| **Claude Memory: Record Decision**      | Save an architectural decision                   |
| **Claude Memory: Set Current Task**     | Set what you're actively working on              |
| **Claude Memory: View Memory**          | Open the memory viewer panel                     |
| **Claude Memory: Reset Memory**         | Clear all saved context for this project         |

**Keyboard shortcut:** `Ctrl+Shift+Alt+C` (Windows/Linux) · `Cmd+Shift+Alt+C` (Mac)  
You can rebind this in **File → Preferences → Keyboard Shortcuts**.

---

## Storage

Context is saved locally inside your project:

```
your-project/
└── .claude-memory/
    └── project-map.json    ← all context (tech stack, tasks, files, decisions)
```

You can commit `.claude-memory/` to share context with your team, or add it to `.gitignore` to keep it private.

---

## Supported Tech Stacks

Auto-detected from config files in your workspace root:

| File                                  | Detected Stacks                                                                                                                                                                     |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                        | Node.js, Next.js, React, Vue, Angular, Svelte, Express, NestJS, Fastify, TypeScript, Prisma, Drizzle, tRPC, Tailwind, GraphQL, Socket.io, Electron, React Native, Jest, Vitest, Zod |
| `requirements.txt` / `pyproject.toml` | Python, Django, Flask, FastAPI, SQLAlchemy, Pandas, NumPy, TensorFlow, PyTorch                                                                                                      |
| `go.mod`                              | Go, Gin, Fiber, Gorilla Mux, GORM                                                                                                                                                   |
| `Cargo.toml`                          | Rust, Actix Web, Axum, Tokio, Diesel                                                                                                                                                |
| `pubspec.yaml`                        | Flutter/Dart                                                                                                                                                                        |
| `pom.xml`                             | Java/Maven, Spring Boot                                                                                                                                                             |
| `build.gradle`                        | Java/Gradle, Kotlin, Android, Spring Boot                                                                                                                                           |
| `composer.json`                       | PHP, Laravel, Symfony                                                                                                                                                               |
| `mix.exs`                             | Elixir, Phoenix                                                                                                                                                                     |
| `Gemfile`                             | Ruby, Ruby on Rails, Sinatra                                                                                                                                                        |

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

## License

[MIT](LICENSE) — free forever.
