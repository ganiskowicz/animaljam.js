export interface Frame {
  w: number,
  h: number,
  x: number,
  y: number,
  b: Buffer,
  s: Buffer,
  png: Buffer,
  sm: number,
}

export interface ImageArrayRepositoryResponse {
  f: Frame[],
  v: number,
}