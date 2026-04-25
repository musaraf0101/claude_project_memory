import * as vscode from 'vscode';
import { ProjectMemory } from '../projectMemory';

export class StatusBarManager {
    private item: vscode.StatusBarItem;

    constructor() {
        this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.item.command = 'claudeMemory.viewMemory';
        this.item.tooltip = 'Claude Project Memory — Click to view context';
    }

    update(memory: ProjectMemory): void {
        const map = memory.getProjectMap();
        const taskCount = map.completedTasks.length;
        const fileCount = map.recentFiles.length;
        const parts: string[] = [];
        if (taskCount > 0) { parts.push(`${taskCount} tasks`); }
        if (fileCount > 0) { parts.push(`${fileCount} files`); }
        const detail = parts.length > 0 ? ` (${parts.join(', ')})` : '';
        this.item.text = `$(database) Claude Memory${detail}`;
        this.item.show();
    }

    dispose(): void {
        this.item.dispose();
    }
}
