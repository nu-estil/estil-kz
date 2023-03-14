import { MikroORM } from '@mikro-orm/core';
import bcrypt from 'bcrypt';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { BadRequestError, HttpError, UnauthorizedError } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../config';
import { User } from '../entities';
import {
    TAuthLoginDto,
    TAuthRegistrationDto,
    TJWTToken,
    TJWTTokenPayload,
    TSendVerificationDto,
    TUser,
} from '../types';
import { SmsService } from './sms/sms';
import { UserService } from './user';

@singleton()
export class AuthService {
    private authConfig;
    private userRepository;

    constructor(
        private ormClient: MikroORM,
        private userService: UserService,
        { config }: ConfigWrapper,
        private smsService: SmsService,
    ) {
        this.userRepository = ormClient.em.getRepository(User);
        this.authConfig = config.auth;
    }

    private getToken = (payload: TJWTTokenPayload): TJWTToken => {
        const access = jwt.sign(payload, this.authConfig.secret, {
            algorithm: 'HS256',
            expiresIn: this.authConfig.accessExpiresIn,
        });

        //create the refresh token with the longer lifespan
        const refresh = jwt.sign(payload, this.authConfig.secret, {
            algorithm: 'HS256',
            expiresIn: this.authConfig.refreshExpiresIn,
        });

        return { access, refresh };
    };

    private setAuthCookie(res: Response, user: TUser) {
        const { access, refresh } = this.getToken({ userId: user.id, username: user.username });

        const opts = {
            secure: this.authConfig.secure,
            httpOnly: true,
        };

        res.cookie('access', `${this.authConfig.prefix} ${access}`, opts);
        res.cookie('refresh', `${this.authConfig.prefix} ${refresh}`, opts);
    }

    private authorizeUser = async ({ username, password }: TAuthLoginDto) => {
        const user = await this.userRepository.findOne(
            { $or: [{ email: username }, { username }] },
            { fields: ['id', 'username', 'password'] },
        );

        if (!user || !(await bcrypt.compare(password, user.password))) {
            const errors = ['username', 'password'].map((property) => {
                const error = new ValidationError();
                error.property = property;
                error.target = { username, password };
                error.constraints = {
                    wrongCredentials: 'Имя пользователя или пароль неверный',
                };
                return error;
            });

            throw errors;
        }

        return user;
    };

    private _parseToken = (token: string) => {
        const [prefix, jwt] = token.split(' ');
        if (prefix !== this.authConfig.prefix) throw new UnauthorizedError('Invalid token prefix');
        return jwt;
    };

    private async _updateUserLastLoggedIn(user: User) {
        user.assign({ lastLoggedIn: new Date() });

        await this.userRepository.flush();
    }

    async loginWithEmail(data: TAuthLoginDto, res: Response) {
        const user = await this.authorizeUser(data);

        await this._updateUserLastLoggedIn(user);

        this.setAuthCookie(res, user);

        return {
            username: user.username,
        };
    }

    _formatPhoneNumber(countryCode: string, phone: string) {
        const phoneNumber = parsePhoneNumber(phone, countryCode as CountryCode);

        if (!phoneNumber) throw new BadRequestError('Невалидный номер телефона.');

        return {
            countryCode: phoneNumber.country!,
            phone: phoneNumber.nationalNumber,
        };
    }
    // TODO: handle unique fields error
    async register({ verificationId, ...data }: TAuthRegistrationDto, res: Response) {
        const verification = await this.smsService.verifyPhone(verificationId);

        if (!verification.isVerified) throw new BadRequestError('Аккаунт не верифицирован.');

        const phone = this._formatPhoneNumber(verification.countryCode, verification.phone);
        const user = await this.userRepository.findOne({
            $or: [{ email: data.email }, { username: data.username }, phone],
        });

        if (user) {
            throw new HttpError(409, 'Пользователь с такой почтой уже существует.');
        }

        const newUser = this.userRepository.create({
            ...data,
            ...phone,
        });

        await this.userRepository.persistAndFlush(newUser);

        this.setAuthCookie(res, newUser);

        return {
            username: newUser.username,
        };
    }

    async refreshToken(req: Request, res: Response) {
        const cookies = req.cookies;
        const refreshToken = cookies?.refresh as string | undefined;

        let payload!: TJWTTokenPayload;

        if (!refreshToken) throw new UnauthorizedError();

        try {
            payload = jwt.verify(
                this._parseToken(refreshToken),
                this.authConfig.secret,
            ) as TJWTTokenPayload;
        } catch (err) {
            this.logout(res);
            throw new UnauthorizedError((err as Error).message);
        }

        const user = await this.userRepository.findOne(
            { id: payload.userId },
            { fields: ['id', 'username'] },
        );

        if (!user) {
            this.logout(res);
            throw new UnauthorizedError('User does not exist');
        }

        await this._updateUserLastLoggedIn(user);

        this.setAuthCookie(res, user);

        return {};
    }

    public logout(res: Response) {
        res.clearCookie('access');
        res.clearCookie('refresh');
        return {};
    }

    public async checkUsername(username: string) {
        const user = await this.userRepository.findOne({
            username: username.trim().toLowerCase(),
        });
        if (user) throw new HttpError(409, 'Username exists');

        return { valid: true };
    }

    public async sendVerification(data: TSendVerificationDto) {
        const phone = this._formatPhoneNumber(data.countryCode, data.phone);
        const user = await this.userRepository.findOne(phone);

        if (user) throw new HttpError(409, 'Данный телефон уже привязан к другому аккаунту');

        return this.smsService.sendVerification(phone);
    }
}
