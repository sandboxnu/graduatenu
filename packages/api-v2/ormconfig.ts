import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from "dotenv";
import { Plan } from "./src/plan/entities/plan.entity";
import { Student } from "./src/student/entities/student.entity";

config({ path: `.env.${process.env.NODE_ENV}` });

const ormconfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD || "",
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  entities: [Student, Plan],
  migrations: ["./dist/migrations/*.js"],
  cli: {
    migrationsDir: "migrations",
  },
  keepConnectionAlive: process.env.NODE_ENV === "testing",
};

console.log(
  `Connecting to ${process.env.POSTGRES_HOST} on port ${process.env.POSTGRES_PORT}`
);

export default ormconfig;
