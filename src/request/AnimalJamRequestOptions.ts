import { RequestInit } from 'node-fetch'
import { Proxy } from '../utils/proxy'

export interface AnimalJamRequestOptions extends RequestInit {
  param?: string
  rawDecompress?: boolean,
  inflateBuffer?: boolean,
  hashParam?: boolean,
  objectMode?: boolean
  headers?: RequestInit['headers']
  includeDeployVersion?: boolean
  includeHost?: boolean,
  proxy?: Proxy
}