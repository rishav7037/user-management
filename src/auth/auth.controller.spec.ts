import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './../common/dto/user/register.dto';
import { LoginDto } from './../common/dto/user/login.dto';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken'),
    verify: jest.fn().mockReturnValue({ userId: 1 }),
  };

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with correct parameters', async () => {
      const dto: RegisterDto = {
        username: 'test',
        password: 'test123',
        role: 'admin',
      };
      mockAuthService.register.mockResolvedValue({ success: true });

      const result = await authController.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ success: true });
    });
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const dto: LoginDto = { username: 'test', password: 'test123' };
      mockAuthService.login.mockResolvedValue({ token: 'token123' });

      const result = await authController.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ token: 'token123' });
    });
  });

  describe('logout', () => {
    it('should call authService.logout with correct token', async () => {
      const authHeader = 'Bearer token123';
      mockAuthService.logout.mockResolvedValue({ success: true });

      const result = await authController.logout(authHeader);

      expect(authService.logout).toHaveBeenCalledWith('token123');
      expect(result).toEqual({ success: true });
    });

    it('should throw an error if no token is provided', async () => {
      const authHeader = '';

      await expect(authController.logout(authHeader)).rejects.toThrow(
        'Token not provided',
      );
    });
  });

  describe('adminAccess', () => {
    it('should return admin access message', () => {
      const result = authController.adminAccess();
      expect(result).toEqual({ message: 'You have admin access!' });
    });
  });
});
