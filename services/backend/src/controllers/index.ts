import { AuthController } from './auth';
import { CityController } from './city';
import { FollowingController } from './following';
import { ImageController } from './image';
import { ProductController } from './product';
import { UserController } from './user';

export const controllers = [
    UserController,
    AuthController,
    ImageController,
    ProductController,
    FollowingController,
    CityController,
];
