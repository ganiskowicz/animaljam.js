import { AnimalJamClient } from '../src'

(async () => {
    const client = new AnimalJamClient()
    const mediaRefId = 354

    const item = await client.media.decode({
        mediaId: mediaRefId,
    })

    if (item.ba == undefined) throw Error(`SWF not found`);

    const swfBuffer = item.ba

    console.log("SWF buffer: ", swfBuffer)
})()