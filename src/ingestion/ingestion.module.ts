import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [IngestionService],
  controllers: [IngestionController],
})
export class IngestionModule {}
