import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

describe('DocumentController', () => {
  let documentController: DocumentController;
  let documentService: DocumentService;

  const mockDocumentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [{ provide: DocumentService, useValue: mockDocumentService }],
    }).compile();

    documentController = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(documentController).toBeDefined();
  });

  describe('createUpdateDocument', () => {
    it('should call documentService.create with the uploaded file', async () => {
      const mockFile: Express.Multer.File = {
        originalname: 'test.pdf',
        buffer: Buffer.from('test data'),
        mimetype: 'application/pdf',
        size: 12345,
        fieldname: 'file',
        encoding: '7bit',
      } as Express.Multer.File;

      const mockResponse = { id: '1', filename: 'test.pdf' };
      mockDocumentService.create.mockResolvedValue(mockResponse);

      const result = await documentController.createUpdateDocument(mockFile);

      expect(documentService.create).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual({
        message: 'File uploaded successfully',
        document: mockResponse,
      });
    });
  });

  describe('findAll', () => {
    it('should call documentService.findAll and return all documents', async () => {
      const mockDocuments = [
        { id: '1', filename: 'doc1.pdf' },
        { id: '2', filename: 'doc2.pdf' },
      ];
      mockDocumentService.findAll.mockResolvedValue(mockDocuments);

      const result = await documentController.findAll();

      expect(documentService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockDocuments);
    });
  });

  describe('findOne', () => {
    it('should call documentService.findOne with the correct ID', async () => {
      const id = '1';
      const mockDocument = { id, filename: 'doc1.pdf' };
      mockDocumentService.findOne.mockResolvedValue(mockDocument);

      const result = await documentController.findOne(id);

      expect(documentService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockDocument);
    });
  });

  describe('remove', () => {
    it('should call documentService.delete with the correct ID', async () => {
      const id = '1';
      const mockResponse = { success: true };
      mockDocumentService.delete.mockResolvedValue(mockResponse);

      const result = await documentController.remove(id);

      expect(documentService.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResponse);
    });
  });
});
