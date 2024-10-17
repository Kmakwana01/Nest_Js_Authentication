import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Color } from './color.model';
import { Op } from 'sequelize';

@Injectable()
export class ColorService {

  constructor(
    @InjectModel(Color)
    private ColorModel: typeof Color,  // Inject the User model
  ) { }

  async findAll() {
    const existingColor = await this.ColorModel.findAll();
    return existingColor;

  }

  async findOne(id: number) {
    const existingColor = await this.ColorModel.findOne({ where: { id } });
    if (!existingColor) {
      throw new ConflictException('Color not exists.');
    }
    return existingColor;
  }

  async update(id: number, updateColorDto: UpdateColorDto) {
    await this.findOne(id);
    const colorWithSameName = await this.ColorModel.findOne({
      where: { name: updateColorDto.name, id: { [Op.ne]: id } } // Exclude current ID
    });

    if (colorWithSameName) {
      throw new ConflictException('Color name already exists.'); // Throw if name already exists
    }
    await this.ColorModel.update({ name: updateColorDto.name, hexCode: updateColorDto.hexCode }, { where: { id } });
    return await this.findOne(id);
  }
  
  async remove(id: number) {
    await this.findOne(id);
    return await this.ColorModel.destroy({ where: { id } }) ? [] : []
  }

  async createColor(name: string, hexCode: string) {

    const existingColor = await this.ColorModel.findOne({ where: { name } });

    if (existingColor) {
      throw new ConflictException('Color name already exists.');
    }

    return await this.ColorModel.create({ name, hexCode });
  }
}
