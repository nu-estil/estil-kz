import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { Express } from 'express';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUI from 'swagger-ui-express';
import { DependencyContainer } from 'tsyringe';
import { ConfigWrapper } from '../config';
/* eslint-disable */
const { defaultMetadataStorage } = require('class-transformer/cjs/storage'); // See https://github.com/typestack/class-transformer/issues/563 for alternatives

export const useSwaggerUI = (app: Express, container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const schemas = validationMetadatasToSchemas({
        classTransformerMetadataStorage: defaultMetadataStorage,
        refPointerPrefix: '#/components/schemas/',
    });
    app.use(
        config.swagger.path,
        swaggerUI.serve,
        swaggerUI.setup(
            routingControllersToSpec(
                getMetadataArgsStorage(),
                {},
                {
                    openapi: '3.0.0',
                    components: { schemas },
                },
            ),
        ),
    );
};
