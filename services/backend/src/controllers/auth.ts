import { Request, Response } from 'express';
import { Body, Get, JsonController, Param, Post, Req, Res } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { AuthLoginDto, AuthRegistrationDto, SendVerificationDto } from '../dto';
import { AuthService } from '../services';

@singleton()
@JsonController('/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    saveUser(@Body({ validate: { whitelist: true } }) data: AuthLoginDto, @Res() res: Response) {
        return this.authService.loginWithEmail(data, res);
    }

    @Post('/register')
    updateUser(
        @Body({ validate: { whitelist: true } }) data: AuthRegistrationDto,
        @Res() res: Response,
    ) {
        return this.authService.register(data, res);
    }

    @Post('/send-verification')
    sendVerification(@Body({ validate: { whitelist: true } }) data: SendVerificationDto) {
        return this.authService.sendVerification(data);
    }

    @Get('/check-username/:username')
    checkUsername(@Param('username') username: string) {
        return this.authService.checkUsername(username);
    }

    @Get('/refresh-token')
    refreshToken(@Req() req: Request, @Res() res: Response) {
        return this.authService.refreshToken(req, res);
    }

    @Get('/logout')
    logout(@Res() res: Response) {
        return this.authService.logout(res);
    }
}
