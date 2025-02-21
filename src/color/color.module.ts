import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { color } from './entities/color.entity';

@Module({
  imports: [SequelizeModule.forFeature([color])],
  controllers: [ColorController],
  providers: [ColorService],
})

export class ColorModule { }
