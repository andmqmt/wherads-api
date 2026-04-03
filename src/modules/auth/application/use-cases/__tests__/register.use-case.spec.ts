import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../../domain/entities/user.entity.js';
import { UserRepository } from '../../../domain/repositories/user.repository.js';
import { RegisterUseCase } from '../register.use-case.js';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = new UserEntity({
    id: 'uuid-1',
    name: 'João',
    email: 'joao@email.com',
    password: 'hashed',
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

    useCase = new RegisterUseCase(userRepository, jwtService);
  });

  it('deve registrar um novo usuário com sucesso', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockUser);

    const result = await useCase.execute({
      name: 'João',
      email: 'joao@email.com',
      password: '123456',
    });

    expect(result.accessToken).toBe('jwt-token');
    expect(result.user.email).toBe('joao@email.com');
    expect(userRepository.create).toHaveBeenCalledTimes(1); // eslint-disable-line @typescript-eslint/unbound-method
  });

  it('deve lançar ConflictException se email já existe', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(
      useCase.execute({
        name: 'João',
        email: 'joao@email.com',
        password: '123456',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
