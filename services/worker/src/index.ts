import 'reflect-metadata';
import { configureServerContainer, createServer } from './server';

(async () => configureServerContainer().then(createServer))();
