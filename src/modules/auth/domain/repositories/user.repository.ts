import { UserEntity } from '../entities/user.entity.js';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract create(
    user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<UserEntity>;
}
