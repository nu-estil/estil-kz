import { IsNotEmpty, IsNumber } from 'class-validator';
import { IndexSearchPayload } from '../types/queue/indexSearch';

export class IndexSearchPayloadDto implements IndexSearchPayload {
    @IsNumber()
    @IsNotEmpty()
    productId!: number;
}
