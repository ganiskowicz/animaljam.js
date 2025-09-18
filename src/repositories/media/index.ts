import { Repository } from '..'
import { API_URL } from '../../Constants'
import { MediaRepositoryOptions } from './MediaRepositoryOptions'
import { MediaRepositoryResponse } from './MediaRepositoryResponse'

export class MediaRepository extends Repository {
  /**
   * Gets the defpack with the specified id.
   * @param id The id of the defpack to get.
   * @returns 
   */
  public async decode (options: MediaRepositoryOptions): Promise<MediaRepositoryResponse> {
    const file = options.mediaId.toString()

    const response = await this.client.request.send<MediaRepositoryResponse>(
      `${API_URL}/[deploy_version]/media/`,
      {
        method: 'GET',
        param: file,
        inflateBuffer: false,
      },
    )

    return response.data
  }
}