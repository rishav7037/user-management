import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  filename: string;

  @IsNotEmpty()
  filepath: string;
}
