export interface CollectorInput {
  userId: string
  name: string
  phone: string
  provinceId: string
  cityId: string
  districtId: string
  villageId: string
  address: string
}

export interface AddCommodityInput {
  commodityId: string
  price: number
  period: Date
}
