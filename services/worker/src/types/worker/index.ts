import { DependencyContainer } from 'tsyringe';
import { TAppConfig } from '../../config';

export type TWorker = {
    name: keyof TAppConfig['bullMQ']['queues'];
    processor: (container: DependencyContainer) => any;
};
