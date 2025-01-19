import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../common/entity/user.entity';
import { CreateUserDto } from './../common/dto/user/create-user.dto';
import { UpdateUserRolesDto } from 'src/common/dto/user/update-user-roles.dto';
import { Role } from 'src/common/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Retrieves all users with their IDs, usernames, and roles.
   * @returns {Promise<User[]>} A list of users.
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
  }

  /**
   * Finds a user by their username.
   * @param {string} username - The username of the user to find.
   * @returns {Promise<User>} The user matching the given username, or null if not found.
   */
  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        role: true,
      },
      where: { username },
    });
  }

  /**
   * Finds a user by their ID.
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<User>} The user matching the given ID.
   * @throws {NotFoundException} If the user with the given ID is not found.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        role: true,
      },
      where: { id },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  /**
   * Creates a new user using the provided data transfer object.
   * @param {CreateUserDto} createUserDto - The data transfer object containing the user's details.
   * @returns {Promise<User>} The created user.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  /**
   * Updates the role of a user by their ID.
   * @param {string} id - The ID of the user whose role needs to be updated.
   * @param {UpdateUserRolesDto} updateUserRolesDto - The data transfer object containing the new role.
   * @returns {Promise<User>} The updated user.
   * @throws {NotFoundException} If the user with the given ID is not found.
   */
  async updateRole(
    id: string,
    updateUserRolesDto: UpdateUserRolesDto,
  ): Promise<User> {
    const user = await this.findOne(id);
    user.role = updateUserRolesDto.role as Role;
    return this.userRepository.save(user);
  }

  /**
   * Deletes a user by their ID.
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<void>} A promise indicating the completion of the deletion.
   * @throws {NotFoundException} If the user with the given ID is not found.
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
