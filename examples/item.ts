import { AnimalJamClient } from '../src'

function getIconId(sortCategory: number) : number {
    if(sortCategory == 0 || sortCategory == 99 || sortCategory == 6 || sortCategory == 5) {
        return 1;
    } else if (sortCategory == 1) {
        return 2;
    } else if (sortCategory == 2 || sortCategory == 3 || sortCategory == 4) {
        return 3;
    }
    return sortCategory + 1;
}

(async () => {
    const client = new AnimalJamClient()
    const denItemId = 354
    const denItemSortCat = 1;

    const item = await client.item.decode({
        itemId: denItemId,
        iconId: getIconId(denItemSortCat),
    })

    if (item.ba == undefined) throw Error(`SWF not found`);

    const swfBuffer = item.ba

    console.log("SWF buffer: ", swfBuffer)
})()