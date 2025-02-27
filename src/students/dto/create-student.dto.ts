import { IsString, IsInt } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  grade: string;
}
