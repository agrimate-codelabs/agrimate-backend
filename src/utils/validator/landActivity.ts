import {z} from 'zod'

export const createLandActivitySchema = z.object({
  plantingId: z.string().uuid(),
  date: z.date(),
  time: z.string(),
  type: z.string(),
  activity: z.object({
    nama_pupuk: z.string().optional(),
    natrium: z.number().optional(),
    fosfor: z.number().optional(),
    kalium: z.number().optional(),
    dosis: z.number().optional(),
    kapasitas_tangki: z.number().optional(),
  }),
  image: z.string()
}).superRefine((data, ctx) => {

  if(data.type === 'Pemberian Pestisida'){
    if(!data.activity.dosis){
      ctx.addIssue({
        path: ['dosis'],
        code: z.ZodIssueCode.custom,
        message: 'Dosis Tidak Boleh Kosong'
      })
    }else if(!data.activity.kapasitas_tangki){
      ctx.addIssue({
        path: ['kapasitas_tangki'],
        code: z.ZodIssueCode.custom,
        message: 'Kapasitas Tangki Tidak Boleh Kosong'
      })
    }
  }else if(data.type === 'Pemberian Pupuk'){
    if(!data.activity.nama_pupuk){
      ctx.addIssue({
        path: ['nama_pupuk'],
        code: z.ZodIssueCode.custom,
        message: 'Nama Pupuk Tidak Boleh Kosong'
      })
    }
    if(!data.activity.natrium){
      ctx.addIssue({
        path: ['natrium'],
        code: z.ZodIssueCode.custom,
        message: 'Natrium Tidak Boleh Kosong'
      })
    }
    if(!data.activity.fosfor){
      ctx.addIssue({
        path: ['fosfor'],
        code: z.ZodIssueCode.custom,
        message: 'Fosfor Tidak Boleh Kosong'
      })
    }else if(!data.activity.kalium){
      ctx.addIssue({
        path: ['kalium'],
        code: z.ZodIssueCode.custom,
        message: 'Kalium Tidak Boleh Kosong'
      })
    }
  }
})