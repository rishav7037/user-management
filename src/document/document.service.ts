import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './../common/entity/document.entity';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class DocumentService {
  private readonly uploadDir = path.resolve(__dirname, '..', '..', 'uploads');

  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  /**
   * Uploads a file, saves its metadata into the database, and stores the file in the upload directory.
   * @param {Express.Multer.File} file - The file to be uploaded.
   * @returns {Promise<Document>} The saved document entity.
   */
  async create(file: Express.Multer.File): Promise<Document> {
    const { originalname, mimetype, size } = file;

    // Save file metadata into database
    const document = new Document();
    document.filename = originalname;
    document.filepath = path.join(this.uploadDir, originalname);
    document.mimetype = mimetype;
    document.size = size;
    document.updatedAt = new Date();

    await fs.mkdir(this.uploadDir, { recursive: true });

    await fs.writeFile(document.filepath, file.buffer);

    return this.documentRepository.save(document);
  }

  /**
   * Deletes a document by its ID.
   * @param {string} id - The ID of the document to delete.
   * @throws {NotFoundException} If the document is not found.
   * @returns {Promise<{ message: string }>} A success message if the document is deleted.
   */
  async delete(id: string) {
    const document = await this.findOne(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    if (document instanceof Document) {
      await this.documentRepository.remove(document);
      return {
        message: 'Document deleted sucessfully',
      };
    }
  }

  /**
   * Retrieves all documents from the database.
   * @returns {Promise<Document[] | { status: number, message: string }>} A list of documents or a not found message.
   */
  async findAll() {
    const documents = await this.documentRepository.find();
    if (documents.length > 0) {
      return documents;
    }
    return {
      status: 404,
      message: 'No documents found',
    };
  }

  /**
   * Finds a document by its ID.
   * @param {string} id - The ID of the document to find.
   * @returns {Promise<Document | { status: number, message: string }>} The document or a not found message.
   */
  async findOne(id: string) {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (document) {
      return document;
    } else
      return {
        status: 404,
        message: `No document with ${id} found`,
      };
  }
}
