import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GetMeUseCase } from './application/use-cases/get-me.use-case.js';
import { LoginUseCase } from './application/use-cases/login.use-case.js';
import { RegisterUseCase } from './application/use-cases/register.use-case.js';
import { UserRepository } from './domain/repositories/user.repository.js';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository.js';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard.js';
import { JwtStrategy } from './presentation/guards/jwt.strategy.js';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_EXPIRATION',
            '1d',
          ) as `${number}${'s' | 'm' | 'h' | 'd'}`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    GetMeUseCase,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
