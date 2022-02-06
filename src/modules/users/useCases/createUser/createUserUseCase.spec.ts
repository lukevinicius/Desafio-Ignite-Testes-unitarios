import {InMemoryUsersRepository} from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserError } from './CreateUserError'
import { CreateUserUseCase } from './CreateUserUseCase'

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should create a user', async () => {
    const user = {
      name: 'lucas',
      email: 'lucas@example.com',
      password: 'password'
    }

    await createUserUseCase.execute(user)

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email)

    expect(userCreated).toHaveProperty("id")
  })

  it('should not be able to create a new user with email exists', async () => {
    const user = {
      name: 'lucas',
      email: 'lucas@example.com',
      password: 'password'
    }

    await createUserUseCase.execute(user)

    await expect(createUserUseCase.execute(user)).rejects.toEqual(new CreateUserError())
  })
})
