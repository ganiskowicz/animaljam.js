import { AnimalJamClient } from '../src'

(async () => {
    const client = new AnimalJamClient()
    const clothingItemLayerDefId = 151
    const clothingItemColor = 1733623808

    await client.imagearray.decode({
        animalId: 1,
        animationId: 25,
        layerId: clothingItemLayerDefId,
        color: clothingItemColor,
        saveFile: true,
        saveFileDefpackPath: "./test",
    })
})()