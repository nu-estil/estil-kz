import 'reflect-metadata';
import { configureServerContainer, createServer } from './server';
import { runMigrations } from './utils';

(async () => {
    const argv = process.argv[2];
    switch (argv) {
        case 'migrate':
            await configureServerContainer().then(runMigrations);
            break;
        default:
            await configureServerContainer().then(createServer);
            break;
    }
})();
