import { ApiOperation, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsOptional } from "class-validator";
import { TransactionType } from "src/common/enums/transations.enum";

export class TransactionsQueryDto {
    @ApiPropertyOptional({ name: 'categoryId', example: 1})
    @IsOptional()
    categoryId: number;

    @ApiPropertyOptional({ name: 'budgetId', example: 1})
    @IsOptional()
    budgetId: number;

    @ApiPropertyOptional({ name: 'current', example: true})
    @IsOptional()
    @IsBoolean()
    current: boolean;

    @ApiPropertyOptional({ name: 'startDate', example: '2024-12-01'})
    @IsOptional()
    @Transform(({ value }) => value ? new Date(value) : value)
    @IsDate()
    startDate: Date;

    @ApiPropertyOptional({ name: 'endDate', example: '2024-12-10'})
    @IsOptional()
    @Transform(({ value }) => value ? new Date(value) : value)
    @IsDate()
    endDate: Date;

    @ApiPropertyOptional({ name: 'type', example: TransactionType.BUDGET})
    @IsOptional()
    @IsEnum(TransactionType)
    type: TransactionType;
}