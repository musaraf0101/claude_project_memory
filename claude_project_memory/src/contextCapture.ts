import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ProjectMemory } from './projectMemory';

interface StackDetector {
    file: string;
    detect: (content: string) => string[];
}

const STACK_DETECTORS: StackDetector[] = [
    {
        file: 'package.json',
        detect: (content) => {
            try {
                const pkg = JSON.parse(content) as {
                    name?: string;
                    dependencies?: Record<string, string>;
                    devDependencies?: Record<string, string>;
                };
                const deps = { ...pkg.dependencies, ...pkg.devDependencies };
                const detected: string[] = [];

                if (deps['next']) { detected.push('Next.js'); }
                else if (deps['react']) { detected.push('React'); }
                if (deps['vue']) { detected.push('Vue.js'); }
                if (deps['@angular/core']) { detected.push('Angular'); }
                if (deps['svelte']) { detected.push('Svelte'); }
                if (deps['express']) { detected.push('Express'); }
                if (deps['fastify']) { detected.push('Fastify'); }
                if (deps['@nestjs/core']) { detected.push('NestJS'); }
                if (deps['typescript'] || pkg.devDependencies?.['typescript']) { detected.push('TypeScript'); }
                if (deps['prisma'] || deps['@prisma/client']) { detected.push('Prisma'); }
                if (deps['mongoose']) { detected.push('MongoDB/Mongoose'); }
                if (deps['sequelize']) { detected.push('Sequelize'); }
                if (deps['typeorm']) { detected.push('TypeORM'); }
                if (deps['tailwindcss']) { detected.push('Tailwind CSS'); }
                if (deps['graphql']) { detected.push('GraphQL'); }
                if (deps['socket.io']) { detected.push('Socket.io'); }
                if (deps['jest']) { detected.push('Jest'); }
                if (deps['vitest']) { detected.push('Vitest'); }
                if (deps['electron']) { detected.push('Electron'); }
                if (deps['react-native']) { detected.push('React Native'); }
                if (deps['trpc'] || deps['@trpc/server']) { detected.push('tRPC'); }
                if (deps['drizzle-orm']) { detected.push('Drizzle ORM'); }
                if (deps['zod']) { detected.push('Zod'); }

                if (pkg.name) { detected.unshift(`Node.js`); }
                return [...new Set(detected)];
            } catch {
                return ['Node.js'];
            }
        },
    },
    {
        file: 'requirements.txt',
        detect: (content) => {
            const c = content.toLowerCase();
            const detected: string[] = ['Python'];
            if (c.includes('django')) { detected.push('Django'); }
            if (c.includes('flask')) { detected.push('Flask'); }
            if (c.includes('fastapi')) { detected.push('FastAPI'); }
            if (c.includes('sqlalchemy')) { detected.push('SQLAlchemy'); }
            if (c.includes('pandas')) { detected.push('Pandas'); }
            if (c.includes('numpy')) { detected.push('NumPy'); }
            if (c.includes('tensorflow')) { detected.push('TensorFlow'); }
            if (c.includes('torch')) { detected.push('PyTorch'); }
            if (c.includes('celery')) { detected.push('Celery'); }
            return detected;
        },
    },
    {
        file: 'pyproject.toml',
        detect: (content) => {
            const c = content.toLowerCase();
            const detected: string[] = ['Python'];
            if (c.includes('django')) { detected.push('Django'); }
            if (c.includes('fastapi')) { detected.push('FastAPI'); }
            if (c.includes('flask')) { detected.push('Flask'); }
            return detected;
        },
    },
    {
        file: 'go.mod',
        detect: (content) => {
            const detected: string[] = ['Go'];
            if (content.includes('gin-gonic/gin')) { detected.push('Gin'); }
            if (content.includes('gorilla/mux')) { detected.push('Gorilla Mux'); }
            if (content.includes('fiber')) { detected.push('Fiber'); }
            if (content.includes('gorm.io')) { detected.push('GORM'); }
            return detected;
        },
    },
    {
        file: 'Cargo.toml',
        detect: (content) => {
            const detected: string[] = ['Rust'];
            if (content.includes('actix-web')) { detected.push('Actix Web'); }
            if (content.includes('axum')) { detected.push('Axum'); }
            if (content.includes('tokio')) { detected.push('Tokio'); }
            if (content.includes('diesel')) { detected.push('Diesel'); }
            return detected;
        },
    },
    {
        file: 'pubspec.yaml',
        detect: () => ['Flutter/Dart'],
    },
    {
        file: 'pom.xml',
        detect: (content) => {
            const detected: string[] = ['Java/Maven'];
            if (content.includes('spring-boot')) { detected.push('Spring Boot'); }
            return detected;
        },
    },
    {
        file: 'build.gradle',
        detect: (content) => {
            const detected: string[] = ['Java/Gradle'];
            if (content.includes('kotlin')) { detected.push('Kotlin'); }
            if (content.includes('android')) { detected.push('Android'); }
            if (content.includes('spring-boot')) { detected.push('Spring Boot'); }
            return detected;
        },
    },
    {
        file: 'composer.json',
        detect: (content) => {
            const detected: string[] = ['PHP'];
            try {
                const pkg = JSON.parse(content) as {
                    require?: Record<string, string>;
                    'require-dev'?: Record<string, string>;
                };
                const deps = { ...pkg.require, ...pkg['require-dev'] };
                if (deps['laravel/framework']) { detected.push('Laravel'); }
                if (deps['symfony/framework-bundle']) { detected.push('Symfony'); }
            } catch { /* ignore */ }
            return detected;
        },
    },
    {
        file: 'mix.exs',
        detect: (content) => {
            const detected: string[] = ['Elixir'];
            if (content.includes('phoenix')) { detected.push('Phoenix'); }
            return detected;
        },
    },
    {
        file: 'Gemfile',
        detect: (content) => {
            const detected: string[] = ['Ruby'];
            if (content.includes('rails')) { detected.push('Ruby on Rails'); }
            if (content.includes('sinatra')) { detected.push('Sinatra'); }
            return detected;
        },
    },
];

export class ContextCapture {
    private disposables: vscode.Disposable[] = [];
    private memory: ProjectMemory;
    private workspacePath: string;

    constructor(memory: ProjectMemory, workspacePath: string) {
        this.memory = memory;
        this.workspacePath = workspacePath;
    }

    start(): void {
        this.detectTechStack();

        const saveWatcher = vscode.workspace.onDidSaveTextDocument((doc) => {
            this.memory.updateFileActivity(doc.fileName, this.workspacePath);
            const fileName = path.basename(doc.fileName);
            if (STACK_DETECTORS.some(d => d.file === fileName)) {
                this.detectTechStack();
            }
        });

        const openWatcher = vscode.workspace.onDidOpenTextDocument((doc) => {
            if (doc.uri.scheme === 'file') {
                this.memory.updateFileActivity(doc.fileName, this.workspacePath);
            }
        });

        this.disposables.push(saveWatcher, openWatcher);
    }

    detectTechStack(): void {
        const detected: string[] = [];

        for (const detector of STACK_DETECTORS) {
            const filePath = path.join(this.workspacePath, detector.file);
            if (fs.existsSync(filePath)) {
                try {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    detected.push(...detector.detect(content));
                } catch { /* ignore unreadable files */ }
            }
        }

        if (detected.length > 0) {
            this.memory.updateTechStack([...new Set(detected)]);
        }
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
    }
}
