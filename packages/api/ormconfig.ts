import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from "dotenv";
import { Plan } from "./src/plan/entities/plan.entity";
import { Student } from "./src/student/entities/student.entity";
import { readFileSync } from "fs";
import { join } from "path";

config({ path: `.env.${process.env.NODE_ENV}.local` });

const ormconfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD || "",
  database: process.env.POSTGRES_DATABASE,
  synchronize: process.env.NODE_ENV === "testing",
  entities: [Student, Plan],
  migrations: ["./dist/migrations/*.js"],
  cli: {
    migrationsDir: "migrations",
  },
  keepConnectionAlive: process.env.NODE_ENV === "testing",
};

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  ormconfig.extra = {
    ssl: {
      ca: readFileSync(
        join(__dirname, "assets", "RDS.us-east-1.ca-bundle.pem")
      ).toString(),
    },
  };
}

export default ormconfig;
