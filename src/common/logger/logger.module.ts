import { Module } from '@nestjs/common';
import { SweetLogger } from './logger.service';

@Module({
  providers: [SweetLogger],
  exports: [SweetLogger],
})
export class LoggerModule {}
