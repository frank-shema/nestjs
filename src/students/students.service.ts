import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './students.entity';

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

  /**
   * Fetch all students
   * @returns Promise<Student[]> - Array of all students
   */
  async findAll(): Promise<Student[]> {
    try {
      return await this.studentRepository.find();
    } catch (error: unknown) {
      this.handleError(error, 'Failed to fetch students');
    }
  }

  /**
   * Fetch a single student by ID (UUID)
   * @param id - The UUID of the student
   * @returns Promise<Student> - The found student
   * @throws NotFoundException if the student is not found
   */
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

  /**
   * Create a new student
   * @param studentData - Partial student data
   * @returns Promise<Student> - The created student
   * @throws BadRequestException if required fields are missing
   */
  async create(studentData: PartialStudent): Promise<Student> {
    try {
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

  /**
   * Update an existing student
   * @param id - The UUID of the student to update
   * @param studentData - Partial student data for updates
   * @returns Promise<Student> - The updated student
   * @throws NotFoundException if the student is not found
   */
  async update(id: string, studentData: PartialStudent): Promise<Student> {
    try {
      const student = await this.studentRepository.findOneBy({ id });
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      Object.assign(student, studentData);
      await this.studentRepository.save(student);
      return student;
    } catch (error: unknown) {
      this.handleError(error, `Failed to update student with ID ${id}`);
    }
  }

  /**
   * Delete a student by ID (UUID)
   * @param id - The UUID of the student to delete
   * @returns Promise<void>
   * @throws NotFoundException if the student is not found
   */
  async remove(id: string): Promise<void> {
    try {
      const result = await this.studentRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
    } catch (error: unknown) {
      this.handleError(error, `Failed to remove student with ID ${id}`);
    }
  }

  private handleError(error: unknown, message: string): never {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    ) {
      throw error;
    } else if (error instanceof Error) {
      throw new BadRequestException(`${message}: ${error.message}`);
    } else {
      throw new BadRequestException(`${message}: Unknown error occurred`);
    }
  }
}
