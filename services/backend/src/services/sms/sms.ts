import { AppLogger, makeAxiosInstance } from '@depop/utils';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { TSendVerificationDto } from '../../types';
import { TVerifyPhone } from './types';

@singleton()
export class SmsService {
    private api;
    private logger;
    constructor({ config }: ConfigWrapper, logger: AppLogger) {
        this.api = makeAxiosInstance({ baseURL: config.microservices.sms.baseUrl }, { retries: 3 });
        this.logger = logger;
    }

    verifyPhone(verificationId: string) {
        return this.api
            .post<TVerifyPhone>('/verify', { verificationId })
            .then(({ data }) => data)
            .catch((err) => {
                this.logger.error(err, 'Error on verifying phone number with code');
                throw err;
            });
    }

    sendVerification(data: TSendVerificationDto) {
        return this.api
            .post<{ verificationId: string; isVerified: boolean }>('/send', data)
            .then(({ data }) => data)
            .catch((err) => {
                this.logger.error(err, 'Error on verifying phone number with code');
                throw err;
            });
    }
}
