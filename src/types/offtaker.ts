export interface OfftakerInput {
  userId: string
  name: string
  phone: string
}

export interface OfftakerOutput {
  id: string
  userId: string
  name: string
  phone: string
  createdAt: Date
  updatedAt: Date
}
