# Setup & Commands Guide

## Requirements

- [VS Code](https://code.visualstudio.com/) 1.74 or later
- [Node.js](https://nodejs.org/) 18 or later
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Option A — Install from .vsix (Recommended for Users)

This is the quickest way to get the extension running without touching source code.

**Step 1 — Download the `.vsix` file**

Download `claude-project-memory-1.0.0.vsix` from the releases page.

**Step 2 — Install it in VS Code**

Open a terminal and run:

```bash
code --install-extension claude-project-memory-1.0.0.vsix
```

Or install via the VS Code UI:

1. Open VS Code
2. Go to **Extensions** sidebar (`Ctrl+Shift+X`)
3. Click the `···` menu at the top right of the Extensions panel
4. Select **Install from VSIX...**
5. Pick the downloaded `.vsix` file

**Step 3 — Open your project**

Open any project folder in VS Code. The extension activates automatically — no configuration needed.

---

## Option B — Build from Source (For Developers)

**Step 1 — Clone the repository**

```bash
git clone https://github.com/yourusername/claude-project-memory.git
cd claude-project-memory
```

**Step 2 — Install dependencies**

```bash
npm install
```

**Step 3 — Compile TypeScript**

```bash
npm run compile
```

To watch for changes during development:

```bash
npm run watch
```

**Step 4 — Run the extension**

1. Open the project folder in VS Code
2. Press **F5**
3. A new **Extension Development Host** window opens
4. Open any project folder in that window — the extension is now active

**Step 5 — Package into a .vsix (optional)**

```bash
npm install -g @vscode/vsce
vsce package
```

This produces `claude-project-memory-1.0.0.vsix` which you can install permanently (see Option A, Step 2).

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

If you don't see it, open the Command Palette (`Ctrl+Shift+P`) and search for **Claude Memory** — any command appearing in the list confirms the extension is active.

---

## Commands

All commands are available via the **Command Palette** (`Ctrl+Shift+P` on Windows/Linux, `Cmd+Shift+P` on Mac). Type `Claude Memory` to filter them.

---

### Continue in New Chat

**Command Palette:** `Claude Memory: Continue in New Chat`  
**Shortcut:** `Ctrl+Shift+Alt+C` (Windows/Linux) · `Cmd+Shift+Alt+C` (Mac)

Generates a full context prompt from everything the extension has captured and copies it to your clipboard. Open a new Claude chat, paste it as your first message, and Claude will continue from exactly where you left off — no re-explaining needed.

**When to use:** Whenever you hit the Claude 200-message limit, start a fresh session, or return after a computer restart.

---

### Save Progress

**Command Palette:** `Claude Memory: Save Progress`

Opens an input box. Type a short description of what you just completed. This is stored and included in every future continuation prompt under **RECENTLY COMPLETED**.

**Example inputs:**
```
Implemented JWT authentication
Created the user registration API
Fixed the password reset email bug
Set up the database schema
```

**When to use:** After finishing any meaningful piece of work — before switching tasks, taking a break, or ending the day.

---

### Record Decision

**Command Palette:** `Claude Memory: Record Decision`

Opens an input box. Type an architectural or technical decision you made. Decisions are included in every future continuation prompt under **KEY DECISIONS MADE**, so Claude always knows the "why" behind your choices.

**Example inputs:**
```
Using JWT stored in httpOnly cookies, not localStorage
Refresh tokens rotate every 7 days
Chose Prisma over raw SQL for type safety
Using Resend for transactional email
Storing images in S3, serving via CloudFront
```

**When to use:** Any time you make a choice that would be painful to re-explain — auth strategy, database design, third-party services, naming conventions.

---

### Set Current Task

**Command Palette:** `Claude Memory: Set Current Task`

Opens an input box pre-filled with your current task (if set). Update it to describe what you're actively working on. This appears at the top of every continuation prompt under **CURRENT TASK**.

**Example inputs:**
```
Building the email verification flow
Fixing the signup form validation bug
Refactoring the auth middleware
Writing tests for the payment module
```

**When to use:** At the start of each work session, or whenever you switch to a new task.  
**To clear it:** Open the command and delete the text before confirming.

---

### View Memory

**Command Palette:** `Claude Memory: View Memory`  
**Status bar:** Click the `🗄 Claude Memory` item in the bottom-right

Opens a panel showing everything the extension has captured for the current project:

| Section | What it shows |
|---|---|
| **Tech Stack** | Auto-detected frameworks and libraries |
| **Current Task** | What you set as your active task |
| **Completed Tasks** | Your logged progress entries |
| **Key Decisions** | Your recorded architectural decisions |
| **Recent Files** | Files modified, with timestamps and save counts |

**When to use:** To review what context will be included in your next continuation prompt, or to check that the extension is tracking correctly.

---

### Reset Memory

**Command Palette:** `Claude Memory: Reset Memory`

Shows a confirmation dialog, then clears all saved context for the current project (tech stack, tasks, decisions, file history). The `.claude-memory/project-map.json` file is reset to a blank state.

**When to use:** When starting a completely new phase of the project, or if the saved context has become outdated.

> **Note:** This only affects the current workspace. Other projects are not affected.

---

## Where Data is Stored

The extension saves everything in a folder inside your project:

```
your-project/
└── .claude-memory/
    └── project-map.json
```

`project-map.json` is a plain JSON file. You can open and read it at any time.

**To share context with your team:** commit `.claude-memory/` to git.  
**To keep it private:** add this line to your `.gitignore`:

```
.claude-memory/
```

---

## Customizing the Keyboard Shortcut

The default shortcut (`Ctrl+Shift+Alt+C`) can be changed:

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
