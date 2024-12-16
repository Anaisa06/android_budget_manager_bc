import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class BudgetQueryDto {
    @ApiPropertyOptional({name: 'current', example: true})
    @IsOptional()
    @IsBoolean()
    current: boolean;

    @ApiPropertyOptional({name: 'categoryId', example: 1})
    @IsOptional()
    @IsNumber()
    categoryId: number;
}