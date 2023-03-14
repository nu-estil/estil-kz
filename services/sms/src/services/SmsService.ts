import { AppLogger, makeAxiosInstance } from '@depop/utils';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../config';
@singleton()
export class SmsService {
    private api;

    public constructor(private logger: AppLogger, { config }: ConfigWrapper) {
        this.api = makeAxiosInstance(
            {
                baseURL: config.mobizon.apiUrl,
                params: { output: 'json', api: 'v1', apiKey: config.mobizon.apiKey },
            },
            { retries: 3 },
        );
    }

    sendMessage(data: Record<'recipient' | 'text' | 'name', string>) {
        return this.api
            .post('/service/Message/SendSmsMessage', data, {
                withCredentials: true,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'cache-control': 'no-cache',
                },
            })
            .catch((err) => {
                this.logger.error(err, 'Error when sending sms');
                throw err;
            });
    }
}
