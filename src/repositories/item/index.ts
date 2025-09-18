import { Repository } from '..'
import { API_URL } from '../../Constants'
import { ItemRepositoryOptions } from './ItemRepositoryOptions'
import { ItemRepositoryResponse } from './ItemRepositoryResponse'

export class ItemRepository extends Repository {
  /**
   * Gets the defpack with the specified id.
   * @param id The id of the defpack to get.
   * @returns 
   */
  public async decode (options: ItemRepositoryOptions): Promise<ItemRepositoryResponse> {
    const file = ((options.itemId << 16) | (options.iconId & 0xFFFF)).toString()

    const response = await this.client.request.send<ItemRepositoryResponse>(
      `${API_URL}/[deploy_version]/items/`,
      {
        method: 'GET',
        param: file,
        inflateBuffer: false,
      },
    )

    return response.data
  }
}