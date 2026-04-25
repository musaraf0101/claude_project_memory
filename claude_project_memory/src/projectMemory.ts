import * as fs from 'fs';
import * as path from 'path';

export interface FileActivity {
    relativePath: string;
    lastModified: string;
    changeCount: number;
}

export interface Task {
    description: string;
    completedAt: string;
}

export interface Decision {
    description: string;
    recordedAt: string;
}

export interface ProjectMap {
    projectName: string;
    workspacePath: string;
    techStack: string[];
    recentFiles: FileActivity[];
    completedTasks: Task[];
    decisions: Decision[];
    currentTask: string;
    lastUpdated: string;
    sessionCount: number;
}

const MAX_RECENT_FILES = 20;
const MAX_TASKS = 50;
const MAX_DECISIONS = 30;

export class ProjectMemory {
    private memoryDir: string;
    private projectMapPath: string;
    private projectMap: ProjectMap;

    constructor(workspacePath: string) {
        this.memoryDir = path.join(workspacePath, '.claude-memory');
        this.projectMapPath = path.join(this.memoryDir, 'project-map.json');
        this.projectMap = this.createDefaultMap(workspacePath);
    }

    private createDefaultMap(workspacePath: string): ProjectMap {
        return {
            projectName: path.basename(workspacePath),
            workspacePath,
            techStack: [],
            recentFiles: [],
            completedTasks: [],
            decisions: [],
            currentTask: '',
            lastUpdated: new Date().toISOString(),
            sessionCount: 0,
        };
    }

    load(): void {
        try {
            if (!fs.existsSync(this.memoryDir)) {
                fs.mkdirSync(this.memoryDir, { recursive: true });
            }
            if (fs.existsSync(this.projectMapPath)) {
                const data = fs.readFileSync(this.projectMapPath, 'utf-8');
                const saved = JSON.parse(data) as Partial<ProjectMap>;
                this.projectMap = { ...this.createDefaultMap(this.projectMap.workspacePath), ...saved };
            }
            this.projectMap.sessionCount = (this.projectMap.sessionCount || 0) + 1;
            this.save();
        } catch {
            this.projectMap = this.createDefaultMap(this.projectMap.workspacePath);
            this.projectMap.sessionCount = 1;
            this.save();
        }
    }

    save(): void {
        try {
            if (!fs.existsSync(this.memoryDir)) {
                fs.mkdirSync(this.memoryDir, { recursive: true });
            }
            this.projectMap.lastUpdated = new Date().toISOString();
            fs.writeFileSync(this.projectMapPath, JSON.stringify(this.projectMap, null, 2), 'utf-8');
        } catch {
            // Silently fail — never disrupt the user's coding workflow
        }
    }

    updateFileActivity(filePath: string, workspacePath: string): void {
        const relativePath = path.relative(workspacePath, filePath).replace(/\\/g, '/');

        if (
            relativePath.startsWith('.claude-memory') ||
            relativePath.includes('node_modules') ||
            relativePath.includes('.git') ||
            relativePath.startsWith('out/')
        ) {
            return;
        }

        const existing = this.projectMap.recentFiles.find(f => f.relativePath === relativePath);
        if (existing) {
            existing.changeCount++;
            existing.lastModified = new Date().toISOString();
            this.projectMap.recentFiles = [
                existing,
                ...this.projectMap.recentFiles.filter(f => f.relativePath !== relativePath),
            ];
        } else {
            this.projectMap.recentFiles.unshift({
                relativePath,
                lastModified: new Date().toISOString(),
                changeCount: 1,
            });
        }

        this.projectMap.recentFiles = this.projectMap.recentFiles.slice(0, MAX_RECENT_FILES);
        this.save();
    }

    updateTechStack(techStack: string[]): void {
        this.projectMap.techStack = techStack;
        this.save();
    }

    addProgress(task: string): void {
        this.projectMap.completedTasks.unshift({
            description: task,
            completedAt: new Date().toISOString(),
        });
        this.projectMap.completedTasks = this.projectMap.completedTasks.slice(0, MAX_TASKS);
        this.save();
    }

    addDecision(decision: string): void {
        this.projectMap.decisions.unshift({
            description: decision,
            recordedAt: new Date().toISOString(),
        });
        this.projectMap.decisions = this.projectMap.decisions.slice(0, MAX_DECISIONS);
        this.save();
    }

    setCurrentTask(task: string): void {
        this.projectMap.currentTask = task;
        this.save();
    }

    getProjectMap(): Readonly<ProjectMap> {
        return this.projectMap;
    }

    reset(): void {
        this.projectMap = this.createDefaultMap(this.projectMap.workspacePath);
        this.save();
    }

    getMemoryDir(): string {
        return this.memoryDir;
    }
}
