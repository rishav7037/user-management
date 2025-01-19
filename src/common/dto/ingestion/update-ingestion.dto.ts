import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateIngestionDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
