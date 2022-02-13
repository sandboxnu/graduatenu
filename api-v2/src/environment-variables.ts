/**
 * The environment variables available through the configuration service.
 */
export interface EnvironmentVariables {
  DB_USERNAME: string;
  DB_URL: string;
  JWT_SECRET_KEY: string;
  JWT_EXPIRE_TIME: number;
  PORT: number;
}
