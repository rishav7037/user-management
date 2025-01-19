import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { UpdateIngestionDto } from './../common/dto/ingestion/update-ingestion.dto';

describe('IngestionController', () => {
  let ingestionController: IngestionController;
  let ingestionService: IngestionService;

  const mockIngestionService = {
    triggerIngestion: jest.fn(),
    updateStatus: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        { provide: IngestionService, useValue: mockIngestionService },
      ],
    }).compile();

    ingestionController = module.get<IngestionController>(IngestionController);
    ingestionService = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(ingestionController).toBeDefined();
  });

  describe('triggerIngestion', () => {
    it('should call ingestionService.triggerIngestion', async () => {
      mockIngestionService.triggerIngestion.mockResolvedValue({
        success: true,
      });

      const result = await ingestionController.triggerIngestion();

      expect(ingestionService.triggerIngestion).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });

  describe('updateStatus', () => {
    it('should call ingestionService.updateStatus with correct parameters', async () => {
      const id = '123';
      const dto: UpdateIngestionDto = { status: 'completed' };
      mockIngestionService.updateStatus.mockResolvedValue({ success: true });

      const result = await ingestionController.updateStatus(id, dto);

      expect(ingestionService.updateStatus).toHaveBeenCalledWith(
        id,
        dto.status,
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('findOne', () => {
    it('should call ingestionService.findById with the correct ID', async () => {
      const id = '123';
      const mockResponse = { id, status: 'in-progress' };
      mockIngestionService.findById.mockResolvedValue(mockResponse);

      const result = await ingestionController.findOne(id);

      expect(ingestionService.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findAll', () => {
    it('should call ingestionService.findAll', async () => {
      const mockResponse = [
        { id: '123', status: 'in-progress' },
        { id: '456', status: 'completed' },
      ];
      mockIngestionService.findAll.mockResolvedValue(mockResponse);

      const result = await ingestionController.findAll();

      expect(ingestionService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });
});
