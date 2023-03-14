import { Body, JsonController, Post } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { ConfirmPhoneDto } from '../../dto/verification';
import { VerificationService } from '../../services';

@singleton()
@JsonController('/public/verification')
export class PublicVerificationController {
    constructor(private verificationService: VerificationService) {}

    @Post('/confirm')
    confirm(@Body({ validate: { whitelist: true } }) data: ConfirmPhoneDto) {
        return this.verificationService.confirm(data);
    }
}
