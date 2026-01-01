import { IsDateString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CheckAvailabilityDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @IsOptional()
  tableId?: number;
}
