import { createConnection, Connection } from "typeorm";
import { config } from "dotenv";
import { Student } from "./src/student/entities/student.entity";
import { Plan } from "./src/plan/entities/plan.entity";

config({ path: `.env.${process.env.NODE_ENV}.local` });

export async function createDatabaseConnection(): Promise<Connection> {
  const ssl =
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";
  return createConnection({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD || "",
    database: process.env.POSTGRES_DATABASE,
    synchronize: false,
    entities: [Student, Plan],
    ssl: ssl ? { rejectUnauthorized: false } : false,
  });
}
