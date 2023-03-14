import { Response } from 'express';
import {
    Authorized,
    Body,
    CurrentUser,
    Get,
    JsonController,
    Param,
    Post,
    Put,
    Res,
    UseBefore,
} from 'routing-controllers';
import { singleton } from 'tsyringe';
import { UserCreateDto, UserUpdateDto } from '../dto';
import { jwtUserWithoutValidation } from '../middlewares';
import { FollowingService, UserService } from '../services';
import { TJWTTokenPayload } from '../types';

@singleton()
@JsonController('/users')
export class UserController {
    constructor(private userService: UserService, private followingService: FollowingService) {}

    @Authorized()
    @Get('/')
    getUsers() {
        return this.userService.getUsers();
    }

    @Authorized()
    @Get('/profile')
    getProfile(@CurrentUser() user: TJWTTokenPayload) {
        return this.userService.getProfile(user);
    }

    @UseBefore(jwtUserWithoutValidation)
    @Get('/:username')
    getUser(@Res() res: Response, @Param('username') username: string) {
        return this.userService.getUser(username, res.locals.userPayload);
    }

    // @UseBefore(jwtUserWithoutValidation)
    @Get('/:username/followers')
    getFollowers(@Param('username') username: string) {
        return this.followingService.getFollowers(username);
    }

    // @UseBefore(jwtUserWithoutValidation)
    @Get('/:username/followings')
    getFollowings(@Param('username') username: string) {
        return this.followingService.getFollowings(username);
    }

    @Post('/')
    saveUser(@Body() data: UserCreateDto) {
        return this.userService.saveUser(data);
    }

    @Authorized()
    @Put('/profile')
    updateProfile(
        @CurrentUser() user: TJWTTokenPayload,
        @Body({ validate: { whitelist: true } }) data: UserUpdateDto,
    ) {
        return this.userService.updateUser(user.userId, data);
    }
}
