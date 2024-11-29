import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrivateService } from 'src/common/decorators/private-service.decorator';

@PrivateService()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}


  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() req: any) {
    const user = req.user;
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('user')
  findByUser(@Request() req: any) {
    const user = req.user;
    return this.categoriesService.findByUserId(user.id);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    return this.categoriesService.remove(+id, user.id);
  }
}
