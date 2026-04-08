import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';

function buildAllowedOrigins(): string[] {
  const envOrigins = (process.env['FRONTEND_URL'] ?? 'http://localhost:3000')
    .split(',')
    .map((o) =>
      o
        .trim()
        .replace(/\/+$/, '')
        .replace(/^["']|["']$/g, ''),
    )
    .filter(Boolean);

  return [...new Set([...envOrigins, 'https://wherads-app.vercel.app'])];
}

function isAllowedOrigin(origin: string, allowedOrigins: string[]): boolean {
  return (
    allowedOrigins.includes(origin) ||
    /^https:\/\/wherads-app(-[\w-]+)?\.vercel\.app$/.test(origin)
  );
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env['NODE_ENV'] === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.enableShutdownHooks();

  const corsLogger = new Logger('CORS');
  const allowedOrigins = buildAllowedOrigins();

  corsLogger.log(`Allowed origins: ${JSON.stringify(allowedOrigins)}`);

  app.use((req: Request, res: Response, next: () => void) => {
    const origin = req.headers.origin;

    if (origin && isAllowedOrigin(origin, allowedOrigins)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type,Authorization,Accept,X-Requested-With',
      );
      res.setHeader('Access-Control-Max-Age', '86400');
    } else if (origin) {
      corsLogger.warn(`Blocked origin: ${origin}`);
    }

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('WherAds API')
    .setDescription('API de insights sobre comportamento do consumidor')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env['PORT'] ?? 3001;
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
