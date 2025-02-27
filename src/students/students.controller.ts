/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './students.entity';
import { ApiParam, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('students') // Group all student-related endpoints under "students" in Swagger
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all students' })
  @ApiResponse({
    status: 200,
    description: 'List of all students',
    type: [Student],
  })
  async findAll(): Promise<Student[]> {
    try {
      return await this.studentsService.findAll();
    } catch (error) {
      throw new BadRequestException('Failed to fetch students');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a student by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The UUID of the student',
  })
  @ApiResponse({ status: 200, description: 'The found student', type: Student })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findOne(@Param('id') id: string): Promise<Student> {
    try {
      return await this.studentsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: 201,
    description: 'The created student',
    type: Student,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      return await this.studentsService.create(createStudentDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create student');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a student by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The UUID of the student',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated student',
    type: Student,
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    try {
      return await this.studentsService.update(id, updateStudentDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The UUID of the student',
  })
  @ApiResponse({ status: 204, description: 'Student deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.studentsService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }
}
