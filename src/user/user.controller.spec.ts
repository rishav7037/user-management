import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './../common/dto/user/create-user.dto';
import { UpdateUserRolesDto } from './../common/dto/user/update-user-roles.dto';
import { Role } from './../common/role.enum';
import { JwtService } from '@nestjs/jwt';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken'),
    verify: jest.fn().mockReturnValue({ userId: 1 }),
  };

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUsername: jest.fn(),
    create: jest.fn(),
    updateRole: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('findAll', () => {
    it('should call userService.findAll and return the result', async () => {
      const mockUsers = [
        { id: '1', name: 'User1' },
        { id: '2', name: 'User2' },
      ];
      mockUserService.findAll.mockResolvedValue(mockUsers);

      const result = await userController.findAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should call userService.findOne with the correct ID', async () => {
      const id = '1';
      const mockUser = { id, name: 'User1' };
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await userController.findOne(id);

      expect(userService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByName', () => {
    it('should call userService.findByUsername with the correct name', async () => {
      const name = 'User1';
      const mockUser = { id: '1', name };
      mockUserService.findByUsername.mockResolvedValue(mockUser);

      const result = await userController.findByName(name);

      expect(userService.findByUsername).toHaveBeenCalledWith(name);
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should call userService.create with the correct DTO', async () => {
      const dto: CreateUserDto = {
        username: 'User1',
        password: 'password123',
        role: 'admin' as Role,
      };
      mockUserService.create.mockResolvedValue({ id: '1', ...dto });

      const result = await userController.create(dto);

      expect(userService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: '1', ...dto });
    });
  });

  describe('updateRoles', () => {
    it('should call userService.updateRole with the correct parameters', async () => {
      const id = '1';
      const dto: UpdateUserRolesDto = { role: 'admin' };
      mockUserService.updateRole.mockResolvedValue({ success: true });

      const result = await userController.updateRoles(id, dto);

      expect(userService.updateRole).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual({ success: true });
    });
  });

  describe('remove', () => {
    it('should call userService.remove with the correct ID', async () => {
      const id = '1';
      mockUserService.remove.mockResolvedValue({ success: true });

      const result = await userController.remove(id);

      expect(userService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({ success: true });
    });
  });
});
