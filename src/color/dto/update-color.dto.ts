import { PartialType } from '@nestjs/mapped-types';
import { CreateColorDto } from './create-color.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class UpdateColorDto extends PartialType(CreateColorDto) {
    // @IsNotEmpty()
    // @IsNumber()
    // id: number;
}
