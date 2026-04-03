import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../../../domain/entities/user.entity.js';
import { UserRepository } from '../../../domain/repositories/user.repository.js';
import { LoginUseCase } from '../login.use-case.js';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const hashedPassword = bcrypt.hashSync('123456', 10);
  const mockUser = new UserEntity({
    id: 'uuid-1',
    name: 'João',
    email: 'joao@email.com',
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    } as jest.Mocked<UserRepository>;

    jwtService = {
      sign: jest.fn().mockReturnValue('jwt-token'),
    } as unknown as jest.Mocked<JwtService>;

    useCase = new LoginUseCase(userRepository, jwtService);
  });

  it('deve fazer login com sucesso', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);

    const result = await useCase.execute({
      email: 'joao@email.com',
      password: '123456',
    });

    expect(result.accessToken).toBe('jwt-token');
    expect(result.user.email).toBe('joao@email.com');
  });

  it('deve lançar UnauthorizedException se usuário não existe', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'naoexiste@email.com', password: '123456' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException se senha está incorreta', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(
      useCase.execute({ email: 'joao@email.com', password: 'errada' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
