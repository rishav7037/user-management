import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { SweetLogger } from './../common/logger/logger.service';

describe('IngestionService', () => {
  let service: IngestionService;
  let logger: SweetLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: SweetLogger,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    logger = module.get<SweetLogger>(SweetLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('triggerIngestion', () => {
    it('should log and return status 200 with message', async () => {
      jest.spyOn(logger, 'log');

      const result = await service.triggerIngestion();

      expect(result.status).toBe(200);
      expect(result.message).toBe('Ingestion triggered');
      expect(logger.log).toHaveBeenCalledWith('Ingestion triggered');
    });
  });

  describe('updateStatus', () => {
    it('should log and return status 200 with message', () => {
      const id = '123';
      const status = 'in progress';
      jest.spyOn(logger, 'log');

      const result = service.updateStatus(id, status);

      expect(result.status).toBe(200);
      expect(result.message).toBe(`Ingestion with ${id} is updated`);
      expect(logger.log).toHaveBeenCalledWith('Ingestion updated');
    });
  });

  describe('findById', () => {
    it('should log and return status 200 with message', () => {
      const id = '123';
      jest.spyOn(logger, 'log');

      const result = service.findById(id);

      expect(result.status).toBe(200);
      expect(result.message).toBe(`No ingestion with ${id} found`);
      expect(logger.log).toHaveBeenCalledWith('get one Ingestion');
    });
  });

  describe('findAll', () => {
    it('should log and return status 200 with message', () => {
      jest.spyOn(logger, 'log');

      const result = service.findAll();

      expect(result.status).toBe(200);
      expect(result.message).toBe('No ingestion found');
      expect(logger.log).toHaveBeenCalledWith('get all Ingestion');
    });
  });
});
