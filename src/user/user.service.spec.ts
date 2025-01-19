import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './../common/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './../common/dto/user/create-user.dto';
import { UpdateUserRolesDto } from './../common/dto/user/update-user-roles.dto';
import { Role } from './../common/role.enum';

describe('UserService', () => {
  let service: UserService;
  let userRepository: any;

  beforeEach(async () => {
    const mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', username: 'user1', role: Role.Admin },
        { id: '2', username: 'user2', role: Role.Viewer },
      ];
      userRepository.find.mockResolvedValue(mockUsers);

      const users = await service.findAll();

      expect(users).toEqual(mockUsers);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const mockUser = { id: '1', username: 'user1', role: Role.Admin };
      userRepository.findOne.mockResolvedValue(mockUser);

      const user = await service.findByUsername('user1');

      expect(user).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'user1' },
        select: { id: true, username: true, role: true },
      });
    });

    it('should return undefined if user not found', async () => {
      userRepository.findOne.mockResolvedValue(undefined);

      const user = await service.findByUsername('nonexistent');

      expect(user).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser = { id: '1', username: 'user1', role: Role.Admin };
      userRepository.findOne.mockResolvedValue(mockUser);

      const user = await service.findOne('1');

      expect(user).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: { id: true, username: true, role: true },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        role: Role.Admin,
        password: 'testPassword',
      };
      const mockUser = { id: '1', username: 'newuser', role: Role.Admin };
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const user = await service.create(createUserDto);

      expect(user).toEqual(mockUser);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('updateRole', () => {
    it('should update and return a user with new role', async () => {
      const mockUser = { id: '1', username: 'user1', role: Role.Admin };
      const updateUserRolesDto: UpdateUserRolesDto = { role: Role.Viewer };
      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue({ ...mockUser, role: Role.Viewer });

      const updatedUser = await service.updateRole('1', updateUserRolesDto);

      expect(updatedUser.role).toBe(Role.Viewer);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        role: Role.Viewer,
      });
    });

    it('should throw NotFoundException if user not found for role update', async () => {
      const updateUserRolesDto: UpdateUserRolesDto = { role: Role.Admin };
      userRepository.findOne.mockResolvedValue(undefined);

      await expect(
        service.updateRole('nonexistent', updateUserRolesDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const mockUser = { id: '1', username: 'user1', role: Role.Admin };
      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.remove.mockResolvedValue(undefined);

      await service.remove('1');

      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found for removal', async () => {
      userRepository.findOne.mockResolvedValue(undefined);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
