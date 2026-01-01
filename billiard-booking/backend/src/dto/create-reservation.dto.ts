import { IsNotEmpty, IsString, IsEmail, IsOptional, IsDateString, IsNumber, Min, Max } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  @IsNotEmpty()
  tableId: number;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(60, { message: 'Mindestdauer ist 60 Minuten' })
  @Max(180, { message: 'Maximaldauer ist 180 Minuten' })
  durationMinutes: number;
}
