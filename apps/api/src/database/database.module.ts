import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false, // Set to false permanently. Source of truth is now migrations.
        ssl: {
          rejectUnauthorized: false, // Required for Supabase in some environments
        },
        retryAttempts: 3,
        retryDelay: 3000,
        extra: {
          // Supabase transaction pooler compatibility
          options: '-c search_path=public',
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
