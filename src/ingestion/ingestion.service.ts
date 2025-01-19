import { Injectable } from '@nestjs/common';
import { SweetLogger } from './../common/logger/logger.service';

@Injectable()
export class IngestionService {
  constructor(private readonly logger: SweetLogger) {}
  async triggerIngestion() {
    this.logger.log('Ingestion triggered');
    return {
      status: 200,
      message: 'Ingestion triggered',
    };
  }

  updateStatus(id: string, status: string) {
    this.logger.log('Ingestion updated');
    return {
      status: 200,
      message: `Ingestion with ${id} is updated`,
    };
  }

  findById(id: string) {
    this.logger.log('get one Ingestion');
    return {
      status: 200,
      message: `No ingestion with ${id} found`,
    };
  }

  findAll() {
    this.logger.log('get all Ingestion');
    return {
      status: 200,
      message: 'No ingestion found',
    };
  }
}
