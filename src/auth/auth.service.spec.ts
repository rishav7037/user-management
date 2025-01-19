import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './../common/entity/user.entity';
import { BlacklistedToken } from './../common/entity/blacklisted-token.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Role } from './../common/role.enum';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockBlacklistRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
  decode: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let blacklistRepository: jest.Mocked<Repository<BlacklistedToken>>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository() },
        {
          provide: getRepositoryToken(BlacklistedToken),
          useValue: mockBlacklistRepository(),
        },
        { provide: JwtService, useValue: mockJwtService() },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    blacklistRepository = module.get(getRepositoryToken(BlacklistedToken));
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should throw ConflictException if username is already taken', async () => {
      userRepository.findOne.mockResolvedValue({
        username: 'testuser',
      } as User);

      await expect(
        service.register({
          username: 'testuser',
          password: 'password123',
          role: 'admin',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash password and save new user', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue({} as User);
      userRepository.save.mockResolvedValue({} as User);

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.register({
        username: 'testuser',
        password: 'password123',
        role: 'admin',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'hashedPassword',
        role: 'admin',
      });
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        code: 200,
        message: 'user created successfully',
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({ username: 'testuser', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      userRepository.findOne.mockResolvedValue({
        username: 'testuser',
        password: 'hashedPassword',
      } as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        service.login({ username: 'testuser', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return access token for valid credentials', async () => {
      userRepository.findOne.mockResolvedValue({
        username: 'testuser',
        password: 'hashedPassword',
        role: 'admin' as Role,
      } as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jwtService.sign.mockReturnValue('accessToken');

      const result = await service.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        role: 'admin',
      });
      expect(result).toEqual({ accessToken: 'accessToken' });
    });
  });

  describe('logout', () => {
    it('should throw UnauthorizedException if token is invalid', async () => {
      jwtService.decode.mockReturnValue(null);

      await expect(service.logout('invalidToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should blacklist token on logout', async () => {
      jwtService.decode.mockReturnValue({
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      blacklistRepository.create.mockReturnValue({} as BlacklistedToken);

      const result = await service.logout('validToken');

      expect(blacklistRepository.create).toHaveBeenCalledWith({
        token: 'validToken',
        expiry: expect.any(Date),
      });
      expect(blacklistRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });

  describe('isTokenBlacklisted', () => {
    it('should return true if token is blacklisted', async () => {
      blacklistRepository.findOne.mockResolvedValue({} as BlacklistedToken);

      const result = await service.isTokenBlacklisted('blacklistedToken');
      expect(result).toBe(true);
    });

    it('should return false if token is not blacklisted', async () => {
      blacklistRepository.findOne.mockResolvedValue(null);

      const result = await service.isTokenBlacklisted('validToken');
      expect(result).toBe(false);
    });
  });
});
