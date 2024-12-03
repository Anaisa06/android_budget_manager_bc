import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrivateService } from 'src/common/decorators/private-service.decorator';
import { TransactionsQueryDto } from 'src/budgets/dto/transactions-query.dto';

@PrivateService()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req: any) {
    return this.transactionsService.create(createTransactionDto, req.user);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get('user')
  findByUser(@Request() req: any, @Query() query: TransactionsQueryDto) {
    return this.transactionsService.findUserTransactions(req.user, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
