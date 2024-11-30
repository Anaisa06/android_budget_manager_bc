import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional } from "class-validator";
import { BudgetFrecuency, BugdetType } from "src/common/enums/budget.enum";

export class CreateBudgetDto {
    @ApiProperty({ name: 'categoryId', example: 1})
    @IsNumber()
    categoryId: number;

    @ApiPropertyOptional({ name: 'startDate', example: '2024-12-01'})
    @IsOptional()
    @Transform(({ value }) => value ? new Date(value) : value )
    @IsDate()
    startDate: Date;

    @ApiPropertyOptional({ name: 'endDate', example: '2024-12-10'})
    @IsOptional()
    @Transform(({ value }) => value ? new Date(value) : value )
    @IsDate()
    endDate: Date;

    @ApiProperty({ name: 'total', example: 300000})
    @IsNumber()
    total: number;

    @ApiProperty({ name: 'type', example: BugdetType.OCASSIONAL})
    @IsEnum(BugdetType)
    type: BugdetType;

    @ApiPropertyOptional({ name: 'frequency', example: BudgetFrecuency.MONTHLY})
    @IsOptional()
    @IsEnum(BudgetFrecuency)
    frequency: BudgetFrecuency
}
