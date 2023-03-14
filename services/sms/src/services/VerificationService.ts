import { AppLogger } from '@depop/utils';
import { MikroORM, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import moment from 'moment';
import { BadRequestError } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../config';
import { Verification } from '../entities/verification';
import {
    TConfirmPhoneDto,
    TSendVerificationSmsDto,
    TVerifyPhoneDto,
} from '../types/dto/verification';
import { SmsService } from './SmsService';
@singleton()
export class VerificationService {
    private config;
    private verificationRepository;
    public constructor(
        private smsService: SmsService,
        private logger: AppLogger,
        private ormClient: MikroORM,
        { config }: ConfigWrapper,
    ) {
        this.config = config;
        this.verificationRepository = ormClient.em.getRepository(Verification);
    }

    private _SMS_EXPIRATION_DURATION = 10 * 60; // in seconds

    private _generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private _formatNumber(countryCode: string, phone: string) {
        const phoneNumber = parsePhoneNumber(phone, countryCode as CountryCode);

        if (!phoneNumber) throw new BadRequestError('Невалидный номер телефона');

        return phoneNumber.format('E.164').replace('+', '');
    }

    private _formatPhoneNumber(countryCode: string, phone: string) {
        const phoneNumber = parsePhoneNumber(phone, countryCode as CountryCode);

        if (!phoneNumber) throw new BadRequestError('Невалидный номер телефона');

        return {
            countryCode: phoneNumber.country!,
            national: phoneNumber.nationalNumber,
            international: phoneNumber.number,
        };
    }

    // todo: create worker for verifications that are pending and expired
    async confirm({ smsCode, verificationId }: TConfirmPhoneDto) {
        const verification = await this.verificationRepository.findOne({
            smsCode,
            id: verificationId,
            isVerified: false,
        });

        // if already verified or expired
        if (!verification || moment().isAfter(moment(verification.expiration)))
            throw new BadRequestError('Невалидный код или уже был использован');

        verification.assign({ isVerified: true });

        await this.verificationRepository.flush();

        return {
            isVerified: true,
        };
    }

    async verify({ verificationId }: TVerifyPhoneDto) {
        const verification = await this.verificationRepository.findOne({
            id: verificationId,
        });

        if (!verification) throw new BadRequestError('Аккаунт не верифицирован');

        return wrap(verification).toJSON();
    }

    async send(data: TSendVerificationSmsDto) {
        const em = this.ormClient.em.fork() as EntityManager;
        await em.begin();

        const phone = this._formatPhoneNumber(data.countryCode, data.phone);

        try {
            const verification = em.create(Verification, {
                phone: phone.national,
                countryCode: phone.countryCode,
                expiration: moment().add(this._SMS_EXPIRATION_DURATION, 'seconds').toDate(),
                smsCode: this._generateCode(),
            });

            em.persist(verification);
            await em.flush();
            // send message if not disabled
            if (!this.config.mobizon.disabled)
                await this.smsService.sendMessage({
                    recipient: phone.international.replace('+', ''),
                    text: `Код подтверждения для Estil.kz: ${verification.smsCode}`,
                    name: 'Estil.kz',
                });
            else {
                console.log('-----------------');
                console.log('SMS disabled, logging verification');
                console.log(phone.countryCode);
                console.log(phone.national);
                console.log(phone.international);
                console.log(verification.smsCode);
                console.log(verification.id);
                console.log('-----------------');
            }
            await em.commit();

            return {
                verificationId: verification.id,
                isVerified: verification.isVerified,
            };
        } catch (e) {
            await em.rollback();
            throw e;
        }
    }
}
