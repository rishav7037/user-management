import { IsString } from 'class-validator';

export class UpdateUserRolesDto {
  @IsString()
  role: string;
}
