import { Authorized, Body, CurrentUser, JsonController, Post } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { ToggleFollowingDto } from '../dto/following';
import { FollowingService } from '../services';
import { TJWTTokenPayload } from '../types';

@singleton()
@JsonController('/followings')
export class FollowingController {
    constructor(private followingService: FollowingService) {}

    @Authorized()
    @Post('/toggle')
    toggleFollowing(@CurrentUser() user: TJWTTokenPayload, @Body() data: ToggleFollowingDto) {
        return this.followingService.toggleFollowing(user, data);
    }
}
