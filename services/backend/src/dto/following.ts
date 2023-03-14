import { ArrayNotEmpty, IsNumber } from 'class-validator';
import { TToggleFollowingDto } from '../types/dto/following';

export class ToggleFollowingDto implements TToggleFollowingDto {
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    userIds!: number[];
}
