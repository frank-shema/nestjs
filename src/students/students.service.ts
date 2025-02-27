import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './students.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new Error(`Student with id ${id} not found`);
    }
    return student;
  }

  async create(student: Partial<Student>): Promise<Student> {
    if (!student.name || !student.age || !student.grade) {
      throw new Error('Missing required fields: name, age, grade');
    }

    // Create and save the student entity
    const newStudent = this.studentRepository.create(student); // Create an instance of the Student entity
    return this.studentRepository.save(newStudent); // Save the student to the database
  }

  async update(id: number, student: Partial<Student>): Promise<void> {
    await this.studentRepository.update(id, student);
  }

  async remove(id: number): Promise<void> {
    await this.studentRepository.delete(id);
  }
}
