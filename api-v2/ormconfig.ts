import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Plan } from './src/plan/entities/plan.entity';
import { Student } from 'src/student/entities/student.entity';

config({ path: `.env.${process.env.NODE_ENV}` });

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || '',
  synchronize: process.env.NODE_ENV !== 'production',
  entities: [Student, Plan],
  migrations: ['src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default ormconfig;
