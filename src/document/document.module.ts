import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './../common/entity/document.entity';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
