import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './common/config/db.config';
import { InterceptorsModule } from './common/interceptors/interceptors.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { BudgetsModule } from './budgets/budgets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig
    }),
    InterceptorsModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    BudgetsModule,
    TransactionsModule,
    TokensModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
