import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('===================================================');
console.log('          مِداد | Midad - Markdown Reader          ');
console.log('===================================================');
console.log('جاري تشغيل الخادم والواجهة الرسومية...\n');

function runProcess(command, args, name) {
    const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        cwd: __dirname
    });

    child.on('error', (err) => {
        console.error(`[${name}] فشل بدء التشغيل:`, err);
    });

    return child;
}

// Start Backend on 3001
const backend = runProcess('node', ['server.cjs'], 'Backend');

// Wait a brief moment before starting Frontend
setTimeout(() => {
    // Start Frontend on 5173
    const frontend = runProcess('npx', ['vite'], 'Frontend');

    const cleanup = () => {
        console.log('\nإيقاف الخوادم...');
        try { backend.kill(); } catch (e) {}
        try { frontend.kill(); } catch (e) {}
        process.exit();
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
}, 1000);
