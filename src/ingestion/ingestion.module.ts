import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { LoggerModule } from './../common/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [IngestionService],
  controllers: [IngestionController],
})
export class IngestionModule {}
