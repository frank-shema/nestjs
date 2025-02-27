import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'your_password',
      database: 'school_db',
      autoLoadEntities: true,
      synchronize: true, // Auto-syncs schema (disable in production)
    }),
    StudentsModule,
  ],
})
export class AppModule {}
