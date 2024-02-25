import argon2 from 'argon2'
import { getByIdSchema } from '../utils/validator'
import { errorHandle, uploadFile, getObject, deleteObject } from '../utils'
export abstract class BaseService {
  private readonly repository: any

  constructor(repository: any) {
    this.repository = repository
  }

  public failedOrSuccessRequest(status: string, data: any) {
    return { status, data }
  }

  public hashData(data: string) {
    return argon2.hash(data)
  }

  public argonVerify(data: string, hashedData: string) {
    return argon2.verify(hashedData, data)
  }

  public generateUniqueToken() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let token = ''
    for (let i = 0; i < 7; i++) {
      token += alphabet[Math.floor(Math.random() * alphabet.length)]
    }
    return token
  }

  async find(query: any, options: any): Promise<any> {
    const data = await this.repository.findAll(query, options)
    if (!data) return this.failedOrSuccessRequest('failed', 'Data Tidak Ditemukan')
    return this.failedOrSuccessRequest('success', data)
  }

  async findAndPaginate(query: any, options: any) {
    const data = await this.repository.findAndCount(query, {
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      ...options
    })
    return this.failedOrSuccessRequest('success', data)
  }

  async findById(id: string): Promise<any> {
    const validateArgs = getByIdSchema.safeParse(id)
    if (!validateArgs.success) return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    const data = await this.repository.findById(id)
    if (!data) return this.failedOrSuccessRequest('failed', 'Data Tidak Ditemukan')
    return this.failedOrSuccessRequest('success', data)
  }

  async delete(id: string) {
    const validateArgs = getByIdSchema.safeParse(id)
    if (!validateArgs.success) return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    const checkData = await this.repository.findById(id)
    if (!checkData) return this.failedOrSuccessRequest('failed', 'Data Tidak Ditemukan')
    const data = await this.repository.delete(id)
    if (!data) return this.failedOrSuccessRequest('failed', data.error)
    return this.failedOrSuccessRequest('success', data)
  }

  async upload(image: Express.Multer.File, bucket: string) {
    try {
      await uploadFile(image, `${bucket}`)
      return this.failedOrSuccessRequest('success', image.filename)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async uploadMultiple(images: Express.Multer.File[], bucket: string) {
    try {
        await Promise.all(images.map(async (image) => {
        return await uploadFile(image, `${bucket}`)
      }))

      const data = images.map((image) => {
        return { [image.fieldname]: image.filename }
      })

      return this.failedOrSuccessRequest('success', data)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async getFile(key: string, bucket: string) {
    try {
      const file = await getObject(key, `${bucket}`)
      return this.failedOrSuccessRequest('success', file)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', 'File not found')
    }
  }

  async deleteFile(key: string, bucket: string) {
    try {
      await deleteObject(key, `${bucket}`)
      return this.failedOrSuccessRequest('success', 'File deleted')
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }
}
