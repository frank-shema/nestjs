import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'Shema0987!!!',
      database: 'nestcrud',
      autoLoadEntities: true,
      synchronize: true, // Auto-syncs schema (disable in production)
    }),
    StudentsModule,
  ],
})
export class AppModule {}
