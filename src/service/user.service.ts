import { BaseService } from './base.service'
import { UserRepository } from '../repository'
import type { UserInput } from '../types'
export class UserService extends BaseService {
  constructor(private readonly userRepository = new UserRepository()) {
    super(userRepository)
  }

  async create(data: UserInput) {
    return await this.userRepository.createUser(data)
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findUserByEmail(email)
  }

  async changePassword(id: string, password: string) {
    return await this.userRepository.updateUserPassword(id, password)
  }

  async verifyUser(id: string) {
    return await this.userRepository.verifyUser(id)
  }

  async updateUserLogin(id: string, refreshToken: string) {
    return await this.userRepository.updateUserLogin(id, refreshToken)
  }

  async userLogout(id: string) {
    return await this.userRepository.userLogout(id)
  }

  async findUserByRefreshToken(refreshToken: string) {
    return await this.userRepository.findUserByRefreshToken(refreshToken)
  }
}
