import { exec } from 'child_process';

exec('tsc', (error, stdout, stderr) => {
    if (error) console.error(`[Build]`, `Error during TypeScript compilation:`, error);
    else console.log(`[Build]`, `TypeScript compilation successful.`);

    if (error) process.exit(1);
});
