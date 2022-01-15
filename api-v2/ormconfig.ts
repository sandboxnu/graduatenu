import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url:
    process.env.DB_URL ||
    'postgres://postgres@localhost:5432/graduatenu_api_dev',
  synchronize: process.env.NODE_ENV !== 'production',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  entities: [Student],
};

export default ormconfig;
