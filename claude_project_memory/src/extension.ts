import * as vscode from 'vscode';
import { ProjectMemory } from './projectMemory';
import { ContextCapture } from './contextCapture';
import { PromptGenerator } from './promptGenerator';
import { StatusBarManager } from './ui/statusBar';
import { MemoryViewer } from './ui/memoryViewer';

let memory: ProjectMemory | undefined;
let contextCapture: ContextCapture | undefined;
let statusBar: StatusBarManager | undefined;
let memoryViewer: MemoryViewer | undefined;

export function activate(context: vscode.ExtensionContext): void {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
        return;
    }

    const workspacePath = folders[0].uri.fsPath;
    const promptGenerator = new PromptGenerator();

    memory = new ProjectMemory(workspacePath);
    memory.load();

    contextCapture = new ContextCapture(memory, workspacePath);
    contextCapture.start();

    statusBar = new StatusBarManager();
    statusBar.update(memory);

    memoryViewer = new MemoryViewer();

    // ── Commands ──────────────────────────────────────────────────

    context.subscriptions.push(
        vscode.commands.registerCommand('claudeMemory.continueInNewChat', async () => {
            if (!memory) { return; }
            const prompt = promptGenerator.generate(memory.getProjectMap());
            await vscode.env.clipboard.writeText(prompt);
            const action = await vscode.window.showInformationMessage(
                '✅ Continuation prompt copied! Paste it in your new Claude chat.',
                'View Memory'
            );
            if (action === 'View Memory') {
                memoryViewer?.show(memory.getProjectMap());
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claudeMemory.saveProgress', async () => {
            if (!memory) { return; }
            const task = await vscode.window.showInputBox({
                title: 'Save Progress',
                prompt: 'What did you just complete?',
                placeHolder: 'e.g. Implemented JWT authentication',
            });
            if (task?.trim()) {
                memory.addProgress(task.trim());
                statusBar?.update(memory);
                memoryViewer?.refresh(memory.getProjectMap());
                vscode.window.showInformationMessage(`Progress saved: "${task.trim()}"`);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claudeMemory.recordDecision', async () => {
            if (!memory) { return; }
            const decision = await vscode.window.showInputBox({
                title: 'Record Decision',
                prompt: 'What architectural decision did you make?',
                placeHolder: 'e.g. Using JWT stored in httpOnly cookies',
            });
            if (decision?.trim()) {
                memory.addDecision(decision.trim());
                memoryViewer?.refresh(memory.getProjectMap());
                vscode.window.showInformationMessage(`Decision recorded: "${decision.trim()}"`);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claudeMemory.setCurrentTask', async () => {
            if (!memory) { return; }
            const current = memory.getProjectMap().currentTask;
            const task = await vscode.window.showInputBox({
                title: 'Set Current Task',
                prompt: 'What are you currently working on? (leave blank to clear)',
                placeHolder: 'e.g. Building email verification flow',
                value: current,
            });
            if (task !== undefined) {
                memory.setCurrentTask(task.trim());
                statusBar?.update(memory);
                memoryViewer?.refresh(memory.getProjectMap());
                const msg = task.trim()
                    ? `Current task set: "${task.trim()}"`
                    : 'Current task cleared.';
                vscode.window.showInformationMessage(msg);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claudeMemory.viewMemory', () => {
            if (!memory) { return; }
            memoryViewer?.show(memory.getProjectMap());
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('claudeMemory.resetMemory', async () => {
            if (!memory) { return; }
            const answer = await vscode.window.showWarningMessage(
                'Reset all Claude Memory for this project? This cannot be undone.',
                { modal: true },
                'Yes, Reset'
            );
            if (answer === 'Yes, Reset') {
                memory.reset();
                statusBar?.update(memory);
                memoryViewer?.refresh(memory.getProjectMap());
                vscode.window.showInformationMessage('Claude Memory has been reset.');
            }
        })
    );

    // ── Keep status bar fresh on every save ───────────────────────

    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(() => {
            if (memory && statusBar) {
                statusBar.update(memory);
            }
        })
    );

    // ── First-run welcome ─────────────────────────────────────────

    const firstRun = context.globalState.get<boolean>('claudeMemory.firstRun', true);
    if (firstRun) {
        context.globalState.update('claudeMemory.firstRun', false);
        vscode.window.showInformationMessage(
            '🧠 Claude Project Memory is active! Use the Command Palette → "Claude Memory: Continue in New Chat" when you need to resume context.',
            'View Memory'
        ).then(action => {
            if (action === 'View Memory') {
                memoryViewer?.show(memory!.getProjectMap());
            }
        });
    }
}

export function deactivate(): void {
    contextCapture?.dispose();
    statusBar?.dispose();
    memoryViewer?.dispose();
}
