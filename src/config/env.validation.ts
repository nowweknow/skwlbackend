import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  //URLS
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  BASIC_URL: string;
  @IsString()
  FRONTEND_URL: string;
  @IsNumber()
  PORT: number;

  //AUTH
  @IsString()
  JWT_SECRET: string;
  @IsString()
  JWT_EXPIRES_IN: string;
  @IsString()
  TOKEN_EXPIRATION: string;
  @IsString()
  JWT_REFRESH_SECRET: string;

  //DATABASE
  @IsString()
  DB_TYPE: string;
  @IsNumber()
  DB_PORT: number;
  @IsString()
  DB_HOST: string;
  @IsString()
  DB_USERNAME: string;
  @IsString()
  DB_PASSWORD: string;
  @IsString()
  DB_DATABASE: string;
  @IsString()
  DB_SYNCHRONIZE: string;
  @IsString()
  DB_LOGGING: string;

  @IsString()
  APP_EMAIL: string;
  @IsString()
  APP_EMAIL_PASSWORD: string;

  //AWS
  @IsString()
  AWS_PUBLIC_BUCKET_NAME: string;
  @IsString()
  AWS_SECRET_ACCESS_KEY: string;
  @IsString()
  AWS_ACCESS_KEY_ID: string;
  @IsString()
  AWS_REGION: string;

  //OTHERS
  @IsString()
  GOOGLE_CLIENT_ID: string;
  @IsString()
  GOOGLE_SECRET: string;
  @IsString()
  APP_ID: string;
  @IsString()
  APP_SECRET: string;
  @IsString()
  TWITTER_CONSUMER_KEY: string;
  @IsString()
  TWITTER_CONSUMER_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors?.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
