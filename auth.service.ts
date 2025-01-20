import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import * as argon2 from 'argon2';
import { User } from './../common/entity/user.entity';
import { RegisterDto } from './../common/dto/user/register.dto';
import { LoginDto } from './../common/dto/user/login.dto';
import { BlacklistedToken } from './../common/entity/blacklisted-token.entity';
import { Role } from './../common/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRepository(BlacklistedToken)
    private readonly blacklistRepository: Repository<BlacklistedToken>,
  ) {}

  /**
   * Registers a new user by saving their details to the database.
   * @param {RegisterDto} registerUserDto - The registration data containing username, password, and role.
   * @returns {Promise<{ code: number; message: string }>} A success message with the HTTP status code.
   * @throws {ConflictException} If the username is already taken.
   */
  async register(registerUserDto: RegisterDto) {
    const { username, password, role } = registerUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) throw new ConflictException('Username already taken');

    const hashedPassword = await argon2.hash(password);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role: role as Role,
    });
    await this.userRepository.save(user);
    return {
      code: 200,
      message: 'User created successfully',
    };
  }

  /**
   * Logs in a user by validating their credentials and generating a JWT access token.
   * @param {LoginDto} loginUserDto - The login data containing username and password.
   * @returns {Promise<{ accessToken: string }>} An object containing the generated JWT access token.
   * @throws {UnauthorizedException} If the credentials are invalid.
   */
  async login(loginUserDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { username: Like(username) },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  /**
   * Logs out a user by blacklisting their JWT token.
   * @param {string} token - The JWT token to blacklist.
   * @returns {Promise<{ message: string }>} A success message indicating the logout process is complete.
   * @throws {UnauthorizedException} If the token is invalid.
   */
  async logout(token: string): Promise<{ message: string }> {
    const decodedToken = this.jwtService.decode(token) as any;
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const expiryDate = new Date(decodedToken.exp * 1000);

    const blacklistedToken = this.blacklistRepository.create({
      token,
      expiry: expiryDate,
    });
    await this.blacklistRepository.save(blacklistedToken);

    return { message: 'Logged out successfully' };
  }

  /**
   * Checks whether a given JWT token is blacklisted.
   * @param {string} token - The JWT token to check.
   * @returns {Promise<boolean>} True if the token is blacklisted, otherwise false.
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.blacklistRepository.findOne({
      where: { token },
    });
    return !!blacklistedToken;
  }
}
