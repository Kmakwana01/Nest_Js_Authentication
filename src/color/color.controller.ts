import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UsePipes, ValidationPipe, BadRequestException, ConflictException } from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Response } from 'express';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) { }

  @Get()
  async findAll() {
    try {

      const allColors = await this.colorService.findAll();

      return {
        statusCode: HttpStatus.OK,  // HTTP status code for created
        message: 'Colors retrieved successfully.',
        data: allColors,
      };

    } catch (error) {

      if (error instanceof ConflictException) {
        return {
          statusCode: HttpStatus.CONFLICT,  // Conflict status code
          message: error.message,
          data: [],
        };
      }

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred.',
        data: [],
      };

    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {

      const allColors = await this.colorService.findOne(id);

      return {
        statusCode: HttpStatus.OK,  // HTTP status code for created
        message: 'Color retrieved successfully.',
        data: allColors,
      };

    } catch (error) {

      if (error instanceof ConflictException) {
        return {
          statusCode: HttpStatus.CONFLICT,  // Conflict status code
          message: error.message,
          data: [],
        };
      }

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred.',
        data: [],
      };

    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    // return this.colorService.update(+id, updateColorDto);
    try {

      const updatedColor = await this.colorService.update(+id, updateColorDto);

      return {
        statusCode: HttpStatus.OK,  // HTTP status code for created
        message: 'Color update successfully.',
        data: updatedColor,
      };

    } catch (error) {

      if (error instanceof ConflictException) {
        return {
          statusCode: HttpStatus.CONFLICT,  // Conflict status code
          message: error.message,
          data: [],
        };
      }

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred.',
        data: [],
      };

    }

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {

      const deletedColor = await this.colorService.remove(+id);

      return {
        statusCode: HttpStatus.OK,  // HTTP status code for created
        message: 'Color deleted successfully.',
        data: deletedColor,
      };

    } catch (error) {

      if (error instanceof ConflictException) {
        return {
          statusCode: HttpStatus.CONFLICT,  // Conflict status code
          message: error.message,
          data: [],
        };
      }

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred.',
        data: [],
      };

    }
  }

  @Post()
  @UsePipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (errors) => {
      const firstError = errors[0].constraints ? Object.values(errors[0].constraints)[0] : 'Validation failed';
      return new BadRequestException(firstError);
    }
  }))

  async createColor(@Body() CreateColorDto: CreateColorDto) {

    try {

      const newColor = await this.colorService.createColor(CreateColorDto.name, CreateColorDto.hexCode);

      return {
        statusCode: HttpStatus.CREATED,  // HTTP status code for created
        message: 'Color created successfully.',
        data: newColor,
      };

    } catch (error) {

      if (error instanceof ConflictException) {
        return {
          statusCode: HttpStatus.CONFLICT,  // Conflict status code
          message: error.message,
          data: [],
        };
      }

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred.',
        data: [],
      };

    }
  }
}
