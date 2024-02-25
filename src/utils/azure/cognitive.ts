export const checkPlantHealth = async (image: any) => {
  try{
    const url = process.env.AZURE_COGNITIVE_CHECK_PLANT_URL as string
    const key = process.env.AZURE_COGNITIVE_CHECK_PLANT_KEY as string
    const result = await fetch(url, {
      method: 'POST',
      body: image.buffer,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Prediction-Key': key
      }
    })
    return result.json()
  }catch(error){
    console.log(error)
    return null
  }
}