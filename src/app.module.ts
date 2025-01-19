import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CatchGatewayExceptionInterceptor } from './common/catchErrorGatewayInterceptor.util';
import { LoggerModule } from './common/logger/logger.module';
import { ConfigsModule } from './common/configs/configs.module';
import { ConfigsService, ORM_CONFIGS } from './common/configs/configs.service';
import { RoleGuard } from './common/role.guard';
import { AuthService } from './auth/auth.service';
import { User } from './common/entity/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { BlacklistedToken } from './common/entity/blacklisted-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () =>
        Object.assign(ORM_CONFIGS, {
          autoLoadEntities: true,
          migrationsRun: true,
        } as TypeOrmModuleOptions),
    }),
    JwtModule.registerAsync({
      imports: [ConfigsModule],
      inject: [ConfigsService],
      useFactory: (configService: ConfigsService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    AuthModule,
    UserModule,
    DocumentModule,
    IngestionModule,
    LoggerModule,
    ConfigsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CatchGatewayExceptionInterceptor,
    },
    JwtService,
  ],
})
export class AppModule {}
