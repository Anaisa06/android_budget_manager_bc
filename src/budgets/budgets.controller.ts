import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { PrivateService } from 'src/common/decorators/private-service.decorator';
import { BudgetQueryDto } from './dto/budget-query.dto';

@PrivateService()
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto, @Request() req: any) {

    const user = req.user;
    return this.budgetsService.create(createBudgetDto, user);
  }

  @Get()
  findAll() {
    return this.budgetsService.findAll();
  }

  @Get('/user')
  findByUser(@Request() req: any, @Query() query: BudgetQueryDto) {
    return this.budgetsService.findByUser(req.user, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.budgetsService.remove(+id, req.user);
  }
}
