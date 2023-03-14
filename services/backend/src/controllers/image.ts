import { Authorized, CurrentUser, JsonController, Post, UploadedFile } from 'routing-controllers';
import { singleton } from 'tsyringe';
import { ImageService } from '../services/image';
import { TJWTTokenPayload } from '../types';

@singleton()
@JsonController('/image')
export class ImageController {
    constructor(private imageService: ImageService) {}

    @Authorized()
    @Post('/save-image')
    saveImage(
        @CurrentUser() user: TJWTTokenPayload,
        @UploadedFile('image', { required: true }) { buffer }: Express.Multer.File,
    ) {
        return this.imageService.saveImage(user.userId, buffer);
    }
}
