import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';

import { CreateUserDto } from './../common/dto/user/create-user.dto';
import { UpdateUserRolesDto } from './../common/dto/user/update-user-roles.dto';
import { RoleGuard } from '../common/role.guard';
import { Roles } from './../common/roles.decorator';

@Controller('users')
@UseGuards(RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles('admin')
  @Get('getById/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles('admin')
  @Get('getByName/:name')
  findByName(@Param('name') name: string) {
    return this.userService.findByUsername(name);
  }

  @Roles('admin')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles('admin')
  @Patch(':id/roles')
  updateRoles(
    @Param('id') id: string,
    @Body() updateUserRolesDto: UpdateUserRolesDto,
  ) {
    return this.userService.updateRole(id, updateUserRolesDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
