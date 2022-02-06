import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let inMemoryUserRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase

describe('AuthenticateUserUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository)
  })

  it('should be able to authenticate a user', async () => {
    await inMemoryUserRepository.create({
      name: 'lucas',
      email: 'lucas@example.com',
      password: await hash('password', 8)
    })

    const response = await authenticateUserUseCase.execute({
      email: 'lucas@example.com',
      password: 'password'
    })

    expect(response).toHaveProperty('token')
    expect(response).toHaveProperty('user')
  })

  it('should not be able authenticate with wrong email or wrong password', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'wrong@example.com',
        password: 'wrong'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
