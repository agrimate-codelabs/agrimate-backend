import { PrismaClient } from "@prisma/client";
import type { LandActivityInput } from "../types";
const prisma = new PrismaClient();
export class LandActivityRepository {

  async create (payload: LandActivityInput) {
    return await prisma.land_activities.create({
      data: {
        plantingId: payload.plantingId,
        date: payload.date,
        time: payload.time,
        type: payload.type,
        activity: payload.activity,
        image: payload.image
      }
    })
  }

  async findById (id: string) {
    return await prisma.land_activities.findUnique({
      where: {
        id: id
      }
    })
  }

  async update (id: string, payload: LandActivityInput) {
    return await prisma.land_activities.update({
      where: {
        id: id
      },
      data: {
        plantingId: payload.plantingId,
        date: payload.date,
        time: payload.time,
        type: payload.type,
        activity: payload.activity,
        image: payload.image
      }
    })
  }

  async findAndCount (plantingId: string, query:any, options: any) {
    const condition: any = {
      where: {
        plantingId: plantingId,
        ...(query.type !== '' && {
          type: query.type
        }),
      },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      orderBy: {
        [options.sort]: options.order
      }
    }
    const data = await prisma.land_activities.findMany({
      ...condition
    })
    const total = await prisma.land_activities.count(condition)
    const pagination = {
      page: options.page,
      limit: options.limit,
      total: total,
      totalPage: Math.ceil(total / options.limit)
    }
    return {
      landActivities: data,
      pagination: pagination
    }
  }

}