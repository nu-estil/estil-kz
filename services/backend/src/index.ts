import 'reflect-metadata';
import { configureDefaultContainer, configureServerContainer, createServer } from './server';
import { runMigrations } from './utils';

(async () => {
    const argv = process.argv[2];
    switch (argv) {
        case 'migrate':
            await configureDefaultContainer().then(runMigrations);
            break;
        default:
            await configureServerContainer().then(createServer);
            break;
    }
})();
