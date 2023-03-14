import { Body, JsonController, Post } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { IndexSearchPayloadDto } from '../dto/queue';
import { QueueService } from '../services';

@singleton()
@JsonController('/queue')
export class QueueController {
    constructor(private queueService: QueueService) {}

    @Post('/index-search')
    async indexSearch(@Body() data: IndexSearchPayloadDto) {
        await this.queueService.indexSearch(data);
        return {};
    }
}
