import * as vscode from 'vscode';
import { ProjectMap } from '../projectMemory';

export class MemoryViewer {
    private panel: vscode.WebviewPanel | undefined;

    show(projectMap: Readonly<ProjectMap>): void {
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.Two);
            this.panel.webview.html = this.buildHtml(projectMap);
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'claudeMemoryViewer',
            'Claude Memory Viewer',
            vscode.ViewColumn.Two,
            { enableScripts: false, retainContextWhenHidden: true }
        );

        this.panel.onDidDispose(() => { this.panel = undefined; });
        this.panel.webview.html = this.buildHtml(projectMap);
    }

    refresh(projectMap: Readonly<ProjectMap>): void {
        if (this.panel) {
            this.panel.webview.html = this.buildHtml(projectMap);
        }
    }

    private buildHtml(map: Readonly<ProjectMap>): string {
        const techStackHtml = map.techStack.length > 0
            ? map.techStack.map(t => `<span class="badge">${this.esc(t)}</span>`).join('')
            : '<span class="empty">Not detected yet</span>';

        const tasksHtml = map.completedTasks.length > 0
            ? map.completedTasks.slice(0, 15).map(t =>
                `<li><span class="check">✓</span><span class="task-text">${this.esc(t.description)}</span><span class="time">${this.ago(t.completedAt)}</span></li>`
            ).join('')
            : '<li class="empty">No tasks logged yet — use "Claude Memory: Save Progress".</li>';

        const decisionsHtml = map.decisions.length > 0
            ? map.decisions.slice(0, 10).map(d =>
                `<li><span class="bullet">•</span>${this.esc(d.description)}</li>`
            ).join('')
            : '<li class="empty">No decisions recorded yet — use "Claude Memory: Record Decision".</li>';

        const filesHtml = map.recentFiles.length > 0
            ? map.recentFiles.slice(0, 15).map(f =>
                `<tr>
                  <td class="mono">${this.esc(f.relativePath)}</td>
                  <td class="dim">${this.ago(f.lastModified)}</td>
                  <td class="dim">${f.changeCount}</td>
                 </tr>`
            ).join('')
            : '<tr><td colspan="3" class="empty">No files tracked yet.</td></tr>';

        const currentTaskBlock = map.currentTask
            ? `<h2>🎯 Current Task</h2><div class="current-task">${this.esc(map.currentTask)}</div>`
            : '';

        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Claude Memory</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: var(--vscode-font-family);
    font-size: var(--vscode-font-size);
    color: var(--vscode-foreground);
    background: var(--vscode-editor-background);
    padding: 20px 24px;
    margin: 0;
    line-height: 1.5;
  }
  .header { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
  h1 { font-size: 1.3em; margin: 0; }
  .session { background: var(--vscode-badge-background); color: var(--vscode-badge-foreground);
    padding: 2px 8px; border-radius: 10px; font-size: 0.78em; }
  .meta { color: var(--vscode-descriptionForeground); font-size: 0.82em; margin-bottom: 20px; }
  h2 { font-size: 1em; font-weight: 600; margin: 20px 0 8px;
    border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 4px; }
  .badge {
    display: inline-block;
    background: var(--vscode-badge-background);
    color: var(--vscode-badge-foreground);
    padding: 2px 9px; border-radius: 10px; font-size: 0.82em; margin: 2px 3px 2px 0;
  }
  .empty { color: var(--vscode-descriptionForeground); font-style: italic; }
  .current-task {
    background: var(--vscode-editor-inactiveSelectionBackground);
    border-left: 3px solid var(--vscode-focusBorder);
    padding: 8px 14px; border-radius: 2px; font-size: 0.95em;
  }
  ul { list-style: none; margin: 0; padding: 0; }
  ul li { display: flex; align-items: baseline; gap: 6px; padding: 3px 0; }
  .check { color: #4caf50; flex-shrink: 0; }
  .bullet { color: var(--vscode-descriptionForeground); flex-shrink: 0; }
  .task-text { flex: 1; }
  .time { color: var(--vscode-descriptionForeground); font-size: 0.78em; white-space: nowrap; }
  table { width: 100%; border-collapse: collapse; font-size: 0.88em; }
  th { text-align: left; padding: 3px 8px;
    color: var(--vscode-descriptionForeground); font-weight: 400;
    border-bottom: 1px solid var(--vscode-panel-border); }
  td { padding: 3px 8px; }
  .mono { font-family: var(--vscode-editor-font-family, monospace); font-size: 0.85em; }
  .dim { color: var(--vscode-descriptionForeground); }
</style>
</head>
<body>
<div class="header">
  <h1>🧠 ${this.esc(map.projectName)}</h1>
  <span class="session">Session #${map.sessionCount}</span>
</div>
<div class="meta">
  Updated: ${new Date(map.lastUpdated).toLocaleString()}
  &nbsp;·&nbsp;
  ${this.esc(map.workspacePath)}
</div>

<h2>⚡ Tech Stack</h2>
<div>${techStackHtml}</div>

${currentTaskBlock}

<h2>✅ Completed Tasks <span class="dim">(${map.completedTasks.length})</span></h2>
<ul>${tasksHtml}</ul>

<h2>🏛️ Key Decisions <span class="dim">(${map.decisions.length})</span></h2>
<ul>${decisionsHtml}</ul>

<h2>📝 Recent Files <span class="dim">(${map.recentFiles.length})</span></h2>
<table>
  <tr><th>File</th><th>Last Modified</th><th>Saves</th></tr>
  ${filesHtml}
</table>
</body>
</html>`;
    }

    private esc(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    private ago(iso: string): string {
        try {
            const diff = Date.now() - new Date(iso).getTime();
            const mins = Math.floor(diff / 60_000);
            const hours = Math.floor(mins / 60);
            const days = Math.floor(hours / 24);
            if (days > 0) { return `${days}d ago`; }
            if (hours > 0) { return `${hours}h ago`; }
            if (mins > 0) { return `${mins}m ago`; }
            return 'just now';
        } catch {
            return '';
        }
    }

    dispose(): void {
        this.panel?.dispose();
    }
}
