import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from "dotenv";
import { Plan } from "./src/plan/entities/plan.entity";
import { Student } from "./src/student/entities/student.entity";

const result = config({ path: `.env.${process.env.NODE_ENV}.local` });
if (result.error) {
  console.error(`FATAL ERROR: ".env.${process.env.NODE_ENV}.local" is missing or invalid! Exiting...`);
  process.exit()
}

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

export default ormconfig;
