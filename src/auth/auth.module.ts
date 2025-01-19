import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './../common/jwt/jwt.strategy';
import { LoggerModule } from './../common/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './../common/entity/user.entity';
import { ConfigsModule } from './../common/configs/configs.module';
import { ConfigsService } from './../common/configs/configs.service';
import { BlacklistedToken } from './../common/entity/blacklisted-token.entity';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, BlacklistedToken]),
    JwtModule.registerAsync({
      imports: [ConfigsModule],
      inject: [ConfigsService],
      useFactory: (configService: ConfigsService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    UserModule,
    LoggerModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
