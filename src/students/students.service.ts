import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './students.entity';

// Define the interface for partial student data (optional fields for updates)
interface PartialStudent {
  name?: string;
  age?: number;
  grade?: string;
}

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  // Fetch all students - throws error if retrieval fails
  async findAll(): Promise<Student[]> {
    try {
      return await this.studentRepository.find();
    } catch (error: unknown) {
      this.handleError(error, 'Failed to fetch students');
    }
  }

  // Fetch a single student by ID - throws NotFoundException if not found
  async findOne(id: string): Promise<Student> {
    try {
      const student = await this.studentRepository.findOneBy({ id });
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      return student;
    } catch (error: unknown) {
      this.handleError(error, `Failed to fetch student with ID ${id}`);
    }
  }

  // Create a new student - throws BadRequestException for invalid data
  async create(studentData: PartialStudent): Promise<Student> {
    try {
      // Validate required fields
      if (!studentData.name || !studentData.age || !studentData.grade) {
        throw new BadRequestException(
          'Missing required fields: name, age, grade',
        );
      }

      const newStudent = this.studentRepository.create(studentData);
      return await this.studentRepository.save(newStudent);
    } catch (error: unknown) {
      this.handleError(error, 'Failed to create student');
    }
  }

  // Update an existing student - returns the updated student
  async update(id: string, studentData: PartialStudent): Promise<Student> {
    try {
      const student = await this.studentRepository.findOneBy({ id });
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      // Merge the new data into the existing student
      Object.assign(student, studentData);
      await this.studentRepository.save(student);
      return student; // Return the updated student
    } catch (error: unknown) {
      this.handleError(error, `Failed to update student with ID ${id}`);
    }
  }

  // Remove a student by ID - returns void
  async remove(id: string): Promise<void> {
    try {
      const result = await this.studentRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
    } catch (error: unknown) {
      this.handleError(error, `Failed to remove student with ID ${id}`);
    }
  }

  // Centralized error handling function
  private handleError(error: unknown, message: string): never {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    ) {
      throw error; // Re-throw NestJS exceptions directly
    } else if (error instanceof Error) {
      throw new BadRequestException(`${message}: ${error.message}`);
    } else {
      throw new BadRequestException(`${message}: Unknown error occurred`);
    }
  }
}
