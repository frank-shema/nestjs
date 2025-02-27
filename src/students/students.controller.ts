import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from './students.entity';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Student> {
    return this.studentsService.findOne(id);
  }

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    // Validate incoming data
    if (
      !createStudentDto.name ||
      !createStudentDto.age ||
      !createStudentDto.grade
    ) {
      throw new BadRequestException(
        'Missing required fields: name, age, grade',
      );
    }
    return this.studentsService.create(createStudentDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() student: Partial<Student>) {
    return this.studentsService.update(id, student);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.studentsService.remove(id);
  }
}
