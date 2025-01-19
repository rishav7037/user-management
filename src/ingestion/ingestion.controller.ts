import { Controller, Post, Patch, Param, Body, Get } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { UpdateIngestionDto } from './../common/dto/ingestion/update-ingestion.dto';
import { Roles } from './../common/roles.decorator';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @Roles('admin', 'editor')
  triggerIngestion() {
    return this.ingestionService.triggerIngestion();
  }

  @Patch(':id')
  @Roles('admin', 'editor')
  updateStatus(
    @Param('id') id: string,
    @Body() updateIngestionDto: UpdateIngestionDto,
  ) {
    return this.ingestionService.updateStatus(id, updateIngestionDto.status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingestionService.findById(id);
  }

  @Get()
  findAll() {
    return this.ingestionService.findAll();
  }
}
