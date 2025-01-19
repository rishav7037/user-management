import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './../common/entity/document.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { NotFoundException } from '@nestjs/common';

describe('DocumentService', () => {
  let service: DocumentService;
  let documentRepository: Repository<Document>;
  let mockFs: jest.Mocked<typeof fs>;

  beforeEach(async () => {
    mockFs = {
      mkdir: jest.fn(),
      writeFile: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(fs.promises)
      .useValue(mockFs)
      .compile();

    service = module.get<DocumentService>(DocumentService);
    documentRepository = module.get<Repository<Document>>(
      getRepositoryToken(Document),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a document and save it to the database', async () => {
    const file = {
      buffer: Buffer.from('fake file data'),
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024,
    };

    const document = new Document();
    document.filename = 'test.pdf';
    document.filepath = path.resolve(
      __dirname,
      '..',
      '..',
      'uploads',
      'test.pdf',
    );
    document.mimetype = 'application/pdf';
    document.size = 1024;
    document.updatedAt = expect.any(Date);

    jest.spyOn(documentRepository, 'save').mockResolvedValue(document);
    jest.spyOn(mockFs, 'mkdir').mockResolvedValue(undefined);
    jest.spyOn(mockFs, 'writeFile').mockResolvedValue(undefined);

    const result = await service.create(file);

    expect(mockFs.mkdir).toHaveBeenCalledWith(
      path.resolve(__dirname, '..', '..', 'uploads'),
      { recursive: true },
    );
    expect(mockFs.writeFile).toHaveBeenCalledWith(
      path.resolve(__dirname, '..', '..', 'uploads', 'test.pdf'),
      file.buffer,
    );
    expect(documentRepository.save).toHaveBeenCalledWith(document);
    expect(result).toEqual(document);
  });
  it('should delete a document successfully', async () => {
    const document = new Document();
    document.id = '1';
    document.filename = 'test.pdf';

    jest.spyOn(documentRepository, 'findOne').mockResolvedValue(document);
    jest.spyOn(documentRepository, 'remove').mockResolvedValue(undefined);

    const result = await service.delete('1');

    expect(documentRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(documentRepository.remove).toHaveBeenCalledWith(document);
    expect(result).toEqual({ message: 'Document deleted sucessfully' });
  });

  it('should throw NotFoundException when document is not found', async () => {
    jest.spyOn(documentRepository, 'findOne').mockResolvedValue(null);

    await expect(service.delete('1')).rejects.toThrowError(
      new NotFoundException('Document not found'),
    );
  });
  it('should return all documents', async () => {
    const documents = [new Document(), new Document()];
    jest.spyOn(documentRepository, 'find').mockResolvedValue(documents);

    const result = await service.findAll();

    expect(documentRepository.find).toHaveBeenCalled();
    expect(result).toEqual(documents);
  });

  it('should return a message when no documents are found', async () => {
    jest.spyOn(documentRepository, 'find').mockResolvedValue([]);

    const result = await service.findAll();

    expect(result).toEqual({
      status: 404,
      message: 'No documents found',
    });
  });
  it('should return a document by ID', async () => {
    const document = new Document();
    document.id = '1';
    jest.spyOn(documentRepository, 'findOne').mockResolvedValue(document);

    const result = await service.findOne('1');

    expect(documentRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toEqual(document);
  });

  it('should return a message when document is not found', async () => {
    jest.spyOn(documentRepository, 'findOne').mockResolvedValue(null);

    const result = await service.findOne('1');

    expect(result).toEqual({
      status: 404,
      message: `No document with 1 found`,
    });
  });
});
