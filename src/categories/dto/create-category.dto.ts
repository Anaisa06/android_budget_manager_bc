import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({ name: 'name' })
    @IsString()
    name: string;

    @ApiProperty({ name: 'isCustom', example: false})
    @IsBoolean()
    isCustom: boolean;

    @ApiPropertyOptional({ name: 'icon' })
    @IsOptional()
    @IsString()
    icon: string;
}
