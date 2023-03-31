/** The environment variables available through the configuration service. */
export interface EnvironmentVariables {
  POSTGRES_PORT: number;
  POSTGRES_USERNAME: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DATABASE: string;
  JWT_SECRET_KEY: string;
  JWT_EXPIRE_TIME: number;
  PORT: number;
  JWT_EXPIRE_TIME_EMAIL: number;
  EMAIL_CONFIRMATION_URL: string;
  EMAIL_SERVICE: string;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  FORGOT_PASSWORD_URL: string
}
