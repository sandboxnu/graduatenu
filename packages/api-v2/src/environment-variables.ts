/**
 * The environment variables available through the configuration service.
 */
export interface EnvironmentVariables {
  POSTGRES_PORT: number;
  POSTGRES_USERNAME: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DATABASE: string;
  JWT_SECRET_KEY: string;
  JWT_EXPIRE_TIME: number;
  PORT: number;
}
