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
    return this.studentRepository.findOne({ where: { id } });
  }

  async create(student: Partial<Student>): Promise<Student> {
    return this.studentRepository.save(student);
  }

  async update(id: number, student: Partial<Student>): Promise<void> {
    await this.studentRepository.update(id, student);
  }

  async remove(id: number): Promise<void> {
    await this.studentRepository.delete(id);
  }
}
