import { Get, JsonController } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { CityService } from '../services';

@singleton()
@JsonController('/cities')
export class CityController {
    constructor(private cityService: CityService) {}

    @Get('/')
    toggleFollowing() {
        return this.cityService.getCities();
    }
}
