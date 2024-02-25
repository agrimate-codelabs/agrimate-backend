import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
  // Soft delete
  prisma.$use(async (params, next) => {
    // Check incoming query type
    if (params.action == 'delete') {
      // Delete queries
      // Change action to an update
      params.action = 'update'
      params.args['data'] = { deletedAt: new Date() }
    }
    if (params.action == 'findMany' || params.action == 'findFirst') {
      // Find many queries
      if (params.args.where) {
        if (params.args.where.deletedAt == undefined) {
          // Exclude deleted records if they have not been explicitly requested
          params.args.where['deletedAt'] = null
        }
      } else {
        params.args['where'] = { deletedAt: null }
      }
    }
    // if (params.action == 'deleteMany') {
    //   // Delete many queries
    //   params.action = 'updateMany'
    //   if (params.args.data != undefined) {
    //     params.args.data['deleted'] = true
    //   } else {
    //     params.args['data'] = { deleted: true }
    //   }
    // }
    return next(params)
  })
}
main()
export default prisma
