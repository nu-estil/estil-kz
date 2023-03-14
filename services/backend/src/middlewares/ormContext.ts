import { MikroORM, RequestContext } from '@mikro-orm/core';
import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { singleton } from 'tsyringe';

@Middleware({ type: 'before', priority: 3 })
@singleton()
export class OrmMiddleware implements ExpressMiddlewareInterface {
    constructor(private ormClient: MikroORM) {}
    async use(request: Request, response: Response, next: NextFunction) {
        // this.ormClient.em = this.ormClient.em.fork();
        // next(); // TODO: FIX THIS
        RequestContext.create(this.ormClient.em, next);
    }
}
