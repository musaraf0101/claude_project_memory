import { ProjectMap } from './projectMemory';

export class PromptGenerator {
    generate(projectMap: Readonly<ProjectMap>): string {
        const lines: string[] = [];

        lines.push('🔄 PROJECT CONTINUATION — Claude Project Memory');
        lines.push('='.repeat(52));
        lines.push('');

        lines.push(`📁 Project:      ${projectMap.projectName}`);
        if (projectMap.techStack.length > 0) {
            lines.push(`⚡ Stack:        ${projectMap.techStack.slice(0, 8).join(', ')}`);
        }
        lines.push(`📅 Last Active:  ${this.formatDate(projectMap.lastUpdated)}`);
        lines.push(`🔢 Session:      #${projectMap.sessionCount}`);
        lines.push('');

        if (projectMap.currentTask) {
            lines.push('🎯 CURRENT TASK:');
            lines.push(`   ${projectMap.currentTask}`);
            lines.push('');
        }

        if (projectMap.completedTasks.length > 0) {
            lines.push('✅ RECENTLY COMPLETED:');
            projectMap.completedTasks.slice(0, 10).forEach(task => {
                lines.push(`   ✓ ${task.description}`);
            });
            lines.push('');
        }

        if (projectMap.decisions.length > 0) {
            lines.push('🏛️ KEY DECISIONS MADE:');
            projectMap.decisions.slice(0, 8).forEach(decision => {
                lines.push(`   • ${decision.description}`);
            });
            lines.push('');
        }

        if (projectMap.recentFiles.length > 0) {
            lines.push('📝 RECENTLY MODIFIED FILES:');
            projectMap.recentFiles.slice(0, 10).forEach(file => {
                const ago = this.timeAgo(file.lastModified);
                const changes = file.changeCount > 1 ? ` (${file.changeCount} saves)` : '';
                lines.push(`   • ${file.relativePath}${changes} — ${ago}`);
            });
            lines.push('');
        }

        lines.push('='.repeat(52));
        lines.push('Context loaded by Claude Project Memory (VSCode extension).');
        lines.push('Continue helping — no full project scan needed!');

        return lines.join('\n');
    }

    private formatDate(isoString: string): string {
        try {
            return new Date(isoString).toLocaleString();
        } catch {
            return isoString;
        }
    }

    private timeAgo(isoString: string): string {
        try {
            const diffMs = Date.now() - new Date(isoString).getTime();
            const mins = Math.floor(diffMs / 60_000);
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
}
