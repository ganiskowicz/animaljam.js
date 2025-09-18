export interface ImageArrayRepositoryOptions {
  /**
   * Whether to save the defpack file to the specified path.
   */
  saveFile?: boolean

  /**
   * The path to save the defpack file to.
   */
  saveFileDefpackPath?: string,

  animalId: number,
  animationId: number,
  layerId: number,
  color: number | string,
}
