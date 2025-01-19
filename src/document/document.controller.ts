import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DocumentService } from './document.service';

import { Roles } from 'src/common/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // Change to memoryStorage
      limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit if needed
    }),
  )
  async createUpdateDocument(@UploadedFile() file: Express.Multer.File) {
    const document = await this.documentService.create(file);
    return { message: 'File uploaded successfully', document };
  }

  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  @Delete(':id')
  @Roles('admin', 'editor')
  remove(@Param('id') id: string) {
    return this.documentService.delete(id);
  }
}
