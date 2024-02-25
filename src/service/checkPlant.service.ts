import { BaseService } from "./base.service";
import { checkPlantHealth } from "../utils";
import { DiseasesPlantsRepository } from "../repository";
export class CheckPlantService extends BaseService  {
  constructor(
    private readonly diseasesPlantsRepository = new DiseasesPlantsRepository()
  ) {
    super(diseasesPlantsRepository);
  }
  async check(image: any) {
    const tempData = await checkPlantHealth(image);
    const probabilty = tempData.predictions.map((item: any) => item.probability)
    const minimalValue = Math.max(...probabilty.filter((value : number) => value >= 0.9));
    if (!tempData || minimalValue === -Infinity){
      return this.failedOrSuccessRequest("failed", "Gagal Cek Kesehatan Tanaman");
    }
    const tagName = tempData.predictions
    .map((item: any) => item.tagName)
    if (tagName.length === 0) return this.failedOrSuccessRequest("failed", 'Gagal Cek Kesehatan Tanaman')
    const result = await this.diseasesPlantsRepository.findByName(tagName[0]);
    if (!result) {
      return this.failedOrSuccessRequest("failed", `Penyakit ${tagName[0]} Belum Terdaftar`);
    }
    return this.failedOrSuccessRequest('success', result);
  }
}