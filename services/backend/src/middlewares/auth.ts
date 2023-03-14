import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Action, ExpressMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { configUtils, ConfigWrapper } from '../config';
import { EUserRole, TJWTTokenPayload } from '../types';

export const makeAuthCheckers = () => {
    return {
        currentUserChecker: (action: Action) => {
            const response = action.response as Response;
            return response.locals?.user;
        },
        authorizationChecker: async (action: Action, roles: EUserRole[]) => {
            const response = action.response as Response;

            const user = response.locals?.user as TJWTTokenPayload | undefined;

            if (!user) throw new HttpError(401, 'Unauthorized');

            // if (roles.length && !roles.includes(user.role))
            //     throw new MethodNotAllowedError()

            return true;
        },
    };
};

/**
 * Middleware to get user from cookie token that might be expired.
 * Used to get user in public APIs that do not throw 401, therefore not trigger refresh token.
 * Sets response.locals.userPayload to user
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const jwtUserWithoutValidation = (req: Request, res: Response, next: NextFunction) => {
    const { prefix } = configUtils.get('auth');

    const accessToken =
        req.headers.authorization || (req.cookies?.access as string | undefined) || '';
    try {
        const [tokenPrefix, token] = accessToken.split(' ');
        if (tokenPrefix === prefix && token) {
            res.locals.userPayload = jwt.decode(token);
        }
        next();
    } catch (err) {
        next();
    }
};

@Middleware({ type: 'before', priority: 2 })
@singleton()
export class AuthMiddleware implements ExpressMiddlewareInterface {
    private config;

    constructor({ config }: ConfigWrapper) {
        this.config = config;
    }

    use(request: Request, response: Response, next: NextFunction): void {
        const { secret, prefix } = this.config.auth;

        const accessToken =
            request.headers.authorization || (request.cookies?.access as string | undefined) || '';

        const [tokenPrefix, token] = accessToken.split(' ');

        if (tokenPrefix === prefix && token) {
            try {
                const verificationResponse = jwt.verify(token, secret) as TJWTTokenPayload;

                response.locals.user = verificationResponse;
                next();
            } catch (error) {
                next();
            }
        } else {
            next();
        }
    }
}
