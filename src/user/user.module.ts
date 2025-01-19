import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './../common/entity/user.entity';
import { LoggerModule } from './../common/logger/logger.module';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LoggerModule],
  providers: [UserService, JwtService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
