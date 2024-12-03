import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TransactionType } from "src/common/enums/transations.enum";

export class CreateTransactionDto {
    @ApiPropertyOptional({ name: 'description'})
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({ name: 'total'})
    @IsNumber()
    total: number;

    @ApiProperty({ name: 'type', example: TransactionType.BUDGET})
    @IsEnum(TransactionType)
    type: TransactionType;

    @ApiProperty({ name: 'budgetId', example: 1})
    @IsNumber()
    budgetId: number;
}
