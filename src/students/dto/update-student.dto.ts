import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateStudentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  grade?: string;
}
