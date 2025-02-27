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

// Define the type for the Param decorator to ensure type safety with UUIDs
type IdParam = { id: string };

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * Retrieve all students
   * @returns Promise<Student[]> - Array of all students
   */
  @Get()
  async findAll(): Promise<Student[]> {
    try {
      return await this.studentsService.findAll();
    } catch (error) {
      throw new BadRequestException('Failed to fetch students');
    }
  }

  /**
   * Retrieve a single student by ID
   * @param id - The UUID of the student
   * @returns Promise<Student> - The found student
   * @throws NotFoundException if the student is not found
   */
  @Get(':id')
  async findOne(@Param() { id }: IdParam): Promise<Student> {
    try {
      return await this.studentsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }

  /**
   * Create a new student
   * @param createStudentDto - DTO containing student data
   * @returns Promise<Student> - The created student
   * @throws BadRequestException if validation fails or creation fails
   */
  @Post()
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

  /**
   * Update an existing student
   * @param id - The UUID of the student to update
   * @param updateStudentDto - DTO containing partial student data
   * @returns Promise<Student> - The updated student
   * @throws NotFoundException if the student is not found
   */
  @Put(':id')
  async update(
    @Param() { id }: IdParam,
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

  /**
   * Delete a student by ID
   * @param id - The UUID of the student to delete
   * @returns Promise<void>
   * @throws NotFoundException if the student is not found
   */
  @Delete(':id')
  async remove(@Param() { id }: IdParam): Promise<void> {
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
