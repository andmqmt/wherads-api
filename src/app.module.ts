import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CampaignModule } from './modules/campaign/campaign.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 30000,
      max: 100,
    }),
    PrismaModule,
    AuthModule,
    CampaignModule,
  ],
})
export class AppModule {}
