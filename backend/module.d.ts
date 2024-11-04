namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    DATABASE_URL: string;
  }
}
