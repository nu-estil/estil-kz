import { Body, JsonController, Post } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { SendVerificationSmsDto, VerifyPhoneDto } from '../../dto/verification';
import { VerificationService } from '../../services';

@singleton()
@JsonController('/private/verification')
export class PrivateVerificationController {
    constructor(private verificationService: VerificationService) {}

    @Post('/verify')
    verify(@Body() data: VerifyPhoneDto) {
        return this.verificationService.verify(data);
    }

    @Post('/send')
    send(@Body({ validate: { whitelist: true } }) data: SendVerificationSmsDto) {
        return this.verificationService.send(data);
    }
}
