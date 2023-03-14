import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/mikroorm';
import { AppLogger } from '@depop/utils';
import { AbstractNamingStrategy, MikroORM, Options } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql'; // or any other driver package
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import AdminJS from 'adminjs';
import { validate } from 'class-validator'; // optional
import { Application } from 'express';
import { DependencyContainer } from 'tsyringe';
import { ConfigWrapper, TAppConfig } from '../config';

export class PascalCaseNamingStrategy extends AbstractNamingStrategy {
    classToTableName(entityName: string): string {
        return entityName;
    }

    joinColumnName(propertyName: string): string {
        return propertyName;
    }

    joinKeyColumnName(entityName: string, referencedColumnName?: string): string {
        return entityName.substring(0, 1).toLowerCase() + entityName.substring(1);
    }

    joinTableName(sourceEntity: string, targetEntity: string, propertyName?: string): string {
        return this.classToTableName(sourceEntity) + '_to_' + this.classToTableName(targetEntity);
    }

    propertyToColumnName(propertyName: string): string {
        return propertyName;
    }

    referenceColumnName(): string {
        return 'id';
    }
}

export const getDBConnectionOpts = (config: TAppConfig): Options<PostgreSqlDriver> => ({
    ...config.db,
    type: 'postgresql',
    highlighter: new SqlHighlighter(),
    namingStrategy: PascalCaseNamingStrategy,
    logger: console.log.bind(console),
});

export const getDBConnection = (config: TAppConfig) => {
    return MikroORM.init<PostgreSqlDriver>(getDBConnectionOpts(config));
};

export const runMigrations = async (container: DependencyContainer) => {
    const orm = container.resolve(MikroORM);
    const logger = container.resolve(AppLogger);

    const migrator = orm.getMigrator();
    const pending = await migrator.getPendingMigrations();

    logger.debug(
        'Pending migrations: ',
        pending.map(({ name }) => name).join(', ') || 'No pending migrations',
    );

    await migrator.up();
    await orm.close();

    logger.debug('Finished migrating');
};

export const useAdmin = (app: Application, container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const { routePrefix, enabled, credentials } = config.admin;

    if (enabled) {
        const orm = container.resolve(MikroORM);
        /* Optional: if you're using class-validator, assign it to Resource */
        Resource.validate = validate;
        /* Tell AdminJS which adapter to use */
        AdminJS.registerAdapter({ Database, Resource });

        const admin = new AdminJS({
            databases: [orm],
            rootPath: routePrefix,
        });

        const router = AdminJSExpress.buildAuthenticatedRouter(admin, {
            authenticate: async (email, password) => {
                /* Your code for verifying email & password goes here */
                return email === credentials.email && password === credentials.password
                    ? { email } // the function should return an object containg user's data if authenticated successfully
                    : null;
            },
            cookiePassword: credentials.cookiePassword,
        });

        app.use(admin.options.rootPath, router);
    }
};
