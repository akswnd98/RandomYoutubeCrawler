declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';

    DB_DIALECT: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
    DB_NAME: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PW: string;

    CHROME_PATH: string;
    CHROMEDRIVER_PATH: string;

    PAGE_ENTER_WAIT_MS: number;
  }
}
