import { Repository } from '..'
import { API_URL } from '../../Constants'
import { ImageArrayRepositoryOptions } from './ImageArrayRepositoryOptions'
import { ImageArrayRepositoryResponse, Frame } from './ImageArrayRepositoryResponse'
import { Jimp } from "jimp";

type RGBA = Object & {
  r: number,
  g: number,
  b: number,
  a: number
}

const gamePalette = [
  "#793647FF", "#762626FF", "#8b4c2bFF", "#9c8726FF", "#426b31FF", "#346851FF", "#396573FF", "#263876FF", "#463779FF", "#61316cFF",
  "#5c2e39FF", "#563520FF", "#6a4e31FF", "#6c643aFF", "#565a36FF", "#4b6351FF", "#33415eFF", "#3d3443FF", "#591d1dFF", "#6d7164FF",
  "#c5647dFF", "#be4b4bFF", "#e08654FF", "#fadb4dFF", "#73ae5aFF", "#5eab89FF", "#67a8bbFF", "#4b66beFF", "#7b66c6FF", "#a05aafFF",
  "#965264FF", "#8c5c3dFF", "#ad8459FF", "#b1a669FF", "#8f9560FF", "#82a58bFF", "#5c6f99FF", "#675a70FF", "#903838FF", "#b8bdabFF",
  "#ee94acFF", "#ed8383FF", "#ffb48aFF", "#ffec95FF", "#a8de90FF", "#95dbbdFF", "#98d4e6FF", "#839bedFF", "#a895efFF", "#d190e0FF",
  "#cd8f9fFF", "#ca9d80FF", "#ddb890FF", "#ded39bFF", "#c5ca9aFF", "#afd1b9FF", "#95a7cfFF", "#a89bb0FF", "#ce7c7cFF", "#d7dccaFF",
  "#8b8a68FF", "#82727dFF", "#69838bFF", "#1a1a1aFF", "#666666FF", "#b3b3b3FF", "#987b35FF", "#80421eFF", "#07050cFF", "#eb6923FF",
  "#26632dFF", "#805912FF", "#20d998FF", "#d9cd20FF", "#080905FF", "#070a08FF", "#1c6075FF", "#060507FF", "#090303FF", "#0b0b0aFF",
  "#e7e5b4FF", "#dac2d3FF", "#b6dce7FF", "#333333FF", "#808080FF", "#ccccccFF", "#f7cd66FF", "#ce723eFF", "#612f25FF", "#100911FF",
  "#34944fFF", "#eea621FF", "#944c22FF", "#ee555dFF", "#eb5ba1FF", "#0d100eFF", "#2098d9FF", "#e13a74FF", "#0e0505FF", "#82d92bFF",
  "#faf8caFF", "#eed8e6FF", "#cceff9FF", "#4d4d4dFF", "#999999FF", "#e6e6e6FF", "#ffe4a1FF", "#fca575FF", "#e1654cFF", "#140e16FF",
  "#8fdc9fFF", "#ffb870FF", "#ffd040FF", "#8c1414FF", "#f589bdFF", "#4b87bfFF", "#4ac3e8FF", "#45ae53FF", "#d32626FF", "#151614FF",
  "#853e3eFF", "#854b3eFF", "#85593eFF", "#85633eFF", "#85713eFF", "#857d3eFF", "#84853eFF", "#77853eFF", "#63853eFF", "#3e8565FF",
  "#3e857fFF", "#3e7285FF", "#3e4e85FF", "#403e85FF", "#4d3e85FF", "#5c3e85FF", "#693e85FF", "#783e85FF", "#853e70FF", "#853e5aFF",
  "#b96161FF", "#b97161FF", "#b98261FF", "#b99061FF", "#b9a161FF", "#b9af61FF", "#b8b961FF", "#a8b961FF", "#8fb961FF", "#61b993FF",
  "#61b9b2FF", "#61a2b9FF", "#6175b9FF", "#6461b9FF", "#7461b9FF", "#8761b9FF", "#9761b9FF", "#a961b9FF", "#b9619fFF", "#b96184FF",
  "#de9e9eFF", "#dea99eFF", "#deb59eFF", "#debf9eFF", "#decc9eFF", "#ded69eFF", "#dcde9eFF", "#d1de9eFF", "#bfde9eFF", "#9edec2FF",
  "#9eded9FF", "#9ecddeFF", "#9eacdeFF", "#9f9edeFF", "#ab9edeFF", "#b99edeFF", "#c49edeFF", "#d29edeFF", "#de9ecbFF", "#de9eb7FF",
  "#705555FF", "#705a55FF", "#706155FF", "#706355FF", "#706955FF", "#706e55FF", "#707055FF", "#6b7055FF", "#637055FF", "#557065FF",
  "#55706fFF", "#556970FF", "#555b70FF", "#565570FF", "#5b5570FF", "#615570FF", "#655570FF", "#6b5570FF", "#705569FF", "#705561FF",
  "#a07e7eFF", "#a0847eFF", "#a08c7eFF", "#a0907eFF", "#a0977eFF", "#a09c7eFF", "#a0a07eFF", "#99a07eFF", "#90a07eFF", "#7ea092FF",
  "#7ea09eFF", "#7e97a0FF", "#7e86a0FF", "#7f7ea0FF", "#857ea0FF", "#8d7ea0FF", "#937ea0FF", "#997ea0FF", "#a07e96FF", "#a07e8cFF",
  "#cbb2b2FF", "#cbb7b2FF", "#cbbcb2FF", "#cbbeb2FF", "#cbc3b2FF", "#cbc7b2FF", "#cbcbb2FF", "#c6cbb2FF", "#becbb2FF", "#b2cbc1FF",
  "#b2cbc8FF", "#b2c3cbFF", "#b2b8cbFF", "#b3b2cbFF", "#b7b2cbFF", "#bdb2cbFF", "#c1b2cbFF", "#c6b2cbFF", "#cbb2c3FF", "#cbb2bcFF",
  "#d34242FF", "#d57740FF", "#e9ce2cFF", "#75c054FF", "#4bc993FF", "#62b4ccFF", "#4264d3FF", "#7b60daFF", "#ae54c1FF", "#0b180bFF",
  "#0e1812FF", "#0d1717FF", "#0d0e15FF", "#110c15FF", "#000000FF", "#ffffff"
];

export class ImageArrayRepository extends Repository {
  /**
   * Gets the defpack with the specified id.
   * @param id The id of the defpack to get.
   * @returns 
   */
  public async decode(options: ImageArrayRepositoryOptions): Promise<ImageArrayRepositoryResponse> {
    const file = ((options.animalId << 24) | (options.animationId << 16) | (options.layerId & 0xFFFF)).toString()

    const response = await this.client.request.send<ImageArrayRepositoryResponse>(
      `${API_URL}/[deploy_version]/imageArrays/`,
      {
        method: 'GET',
        param: file,
      },
    )

    const palette = this.buildLayerPalette(options.color)
    for (const frame of response.data.f) {
      frame.png = await this.decodeFrame(frame, palette);
    }

    if (options?.saveFile) {
      const path = options?.saveFileDefpackPath ?? `./${options.animalId}-${options.animationId}-${options.layerId}`
      for (let i=0; i < response.data.f.length; i++) {
        await this.saveAssetFile(`${i + 1}.png`, path, response.data.f[i].png);
      }
    }

    return response.data
  }

  /**
   * Converts a 32 bit RGBA integer into a hexidecimal string.
   * @param decimal 32 bit RGBA integer.
   * @returns 
   */
  private decimalToHex(decimal: number): string {
    return `#${(decimal >>> 0).toString(16).padStart(8, "0")}`;
  }

  /**
   * Converts a hexidecimal string into a 32 bit RGBA integer.
   * @param hex Hexidecimal string.
   * @returns 
   */
  private hexToDecimal(hex: string): number {
    return parseInt(hex.slice(1), 16) >>> 0
  }

  /**
   * Converts an RGBA object into a hexidecimal string.
   * @param rgba RGBA object.
   * @returns 
   */
  // private rgbaToHex(rgba: RGBA): string {
  //   return `#${((rgba.r & 0xFF) << 24 | (rgba.g & 0xFF) << 16 | (rgba.b & 0xFF) << 8 | rgba.a & 0xFF).toString(16).padStart(8, "0")}`;
  // }

  /**
   * Converts a hexidecimal string into an RGBA object.
   * @param hex Hexidecimal string.
   * @returns 
   */
  private hexToRGBA(hex: string): RGBA {
    const decimal = this.hexToDecimal(hex);
    return { r: decimal >> 24 & 0xFF, g: decimal >> 16 & 0xFF, b: decimal >> 8 & 0xFF, a: decimal & 0xFF };
  }

  /**
   * Converts an array of four hexidecimal strings into a 32 bit integer, encoding each strings respective index in the game palette.
   * @param hexes An array of four hexidecimal strings found in the game palette.
   * @returns 
   */
  public hexesToColor(hexes: [string, string, string, string]): number {
    return (gamePalette.indexOf(hexes[0]) & 0xFF) << 24 | (gamePalette.indexOf(hexes[1]) & 0xFF) << 16 | (gamePalette.indexOf(hexes[2]) & 0xFF) << 8 | gamePalette.indexOf(hexes[3]) & 0xFF;
  }

  /**
   * Converts a 32 bit integer describing palette indexes back into an array of the respective hexadecimal values.
   * @param color A 32 bit integer describing color indexes for a layer.
   * @returns 
   */
  public colorToHexes(color: number | string): [string, string, string, string] {
    color = (typeof color == "string" ? parseInt(color) : color) >>> 0;
    return [gamePalette[color >> 24 & 0xFF] ?? "#793647FF", gamePalette[color >> 16 & 0xFF] ?? "#793647FF", gamePalette[color >> 8 & 0xFF] ?? "#793647FF", gamePalette[color & 0xFF] ?? "#793647FF"];
  }

  /**
   * Average two RGBA objects.
   * @param rgba1 RGBA object 1.
   * @param rgba2 RGBA object 2.
   * @returns 
   */
  private mixRGBA(rgba1: RGBA = this.hexToRGBA("#793647FF"), rgba2: RGBA = this.hexToRGBA("#793647FF")): RGBA {
    return { r: (rgba1.r + rgba2.r) / 2, g: (rgba1.g + rgba2.g) / 2, b: (rgba1.b + rgba2.b) / 2, a: (rgba1.a + rgba2.a) / 2 }
  }

  /**
   * Rotate byte.
   * @param decimal 32 Bit Integer.
   * @returns 
   */
  private rotate(decimal: number): number {
    return (decimal << 8) | ((decimal >>> 24) & 0xFF)
  }

  private setColorGradient(itemPalette: string[], rgba: RGBA = this.hexToRGBA("#793647FF"), start: number, count: number) {
    let { r, g, b } = rgba
    let [rm, gm, bm] = [r / (count + 2), g / (count + 2), b / (count + 2)]
    for (let i = 0; i < count; i++) {
      let paletteIndex = start + count - 1 - i;
      let decimal = (r - rm * i) << 16 | (g - gm * i) << 8 | (b - bm * i);
      itemPalette[paletteIndex] = this.decimalToHex(this.rotate(decimal | -16777216));
      itemPalette[paletteIndex + 25] = this.decimalToHex(this.rotate(decimal | -1073741824));
      itemPalette[paletteIndex + 25 * 2] = this.decimalToHex(this.rotate(decimal | -2147483648));
      itemPalette[paletteIndex + 25 * 3] = this.decimalToHex(this.rotate(decimal | 0x40000000));
    }
  }

  /**
  * Converts a 32 bit integer describing palette indexes into a full palette.
  * @param color A 32 bit integer describing color indexes for a layer.
  * @returns 
  */
  private buildLayerPalette(color: number | string): string[] {
    color = (typeof color == "string" ? parseInt(color) : color) >>> 0;
    const rgbas = this.colorToHexes(color).map((hex) => this.hexToRGBA(hex));
    let itemPalette: string[] = [];

    this.setColorGradient(itemPalette, rgbas[0], 1, 3);
    this.setColorGradient(itemPalette, rgbas[1], 4, 3);
    this.setColorGradient(itemPalette, rgbas[2], 7, 3);
    this.setColorGradient(itemPalette, rgbas[3], 10, 3);
    this.setColorGradient(itemPalette, this.mixRGBA(rgbas[0], rgbas[1]), 13, 2);
    this.setColorGradient(itemPalette, this.mixRGBA(rgbas[1], rgbas[2]), 15, 2);
    this.setColorGradient(itemPalette, this.mixRGBA(rgbas[0], rgbas[2]), 17, 2);
    this.setColorGradient(itemPalette, this.mixRGBA(rgbas[0], rgbas[3]), 19, 2);
    this.setColorGradient(itemPalette, this.mixRGBA(rgbas[1], rgbas[3]), 21, 2);
    this.setColorGradient(itemPalette, this.mixRGBA(rgbas[2], rgbas[3]), 23, 2);

    return itemPalette
  }

  /**
   * Decodes a frame with the provided palette.
   * @param color A 32 bit integer describing color indexes for a layer.
   * @returns 
   */
  private async decodeFrame(frame: Frame, palette: string[]): Promise<Buffer> {
    const decimalPalette = palette.map((hex) => this.hexToDecimal(hex) >>> 0);
    const imageBuffer = Buffer.alloc(frame.w * frame.h * 4);

    const bbuf = frame.b, sbuf = frame.s
    const blen = bbuf.length, slen = sbuf.length
    const h = frame.h, w = frame.w
    const sm = frame.sm

    let x = 0, y = 0, pos = 0;
    while (pos < blen && y < h) {
      let paletteIndex = bbuf[pos++];
      let count = 1;
      if (paletteIndex & 0x80) {
        paletteIndex &= 0x7f;
        count = (bbuf[pos++] || 0) + 1;
      }

      if (paletteIndex === 0) {
        for (let i = 0; i < count; i++) {
          x++;
          if (x >= w) { x = 0; y++; if (y >= h) break; }
        }
      } else {
        const decimal = decimalPalette[paletteIndex] ?? this.hexToDecimal("#793647FF");
        for (let i = 0; i < count; i++) {
          if (y >= h) break;
          const offset = (y * w + x) * 4
          imageBuffer.writeUInt8(decimal >>> 24 & 0xFF, offset)
          imageBuffer.writeUInt8(decimal >>> 16 & 0xFF, offset + 1)
          imageBuffer.writeUInt8(decimal >>> 8 & 0xFF, offset + 2)
          imageBuffer.writeUInt8(decimal & 0xFF, offset + 3)
          x++;
          if (x >= w) { x = 0; y++; }
        }
      }
    }

    if (sbuf && slen > 0) {
      let x = 0, y = 0, pos = 0;

      while (pos < slen && y < h) {
        let value = sbuf[pos++];
        let count = 1;
        if (value & 0x80) {
          value &= 0x7f;
          count = (sbuf[pos++] || 0) + 1;
        }

        if (value === 0) {
          for (let i = 0; i < count; i++) {
            x++;
            if (x >= w) { x = 0; y++; if (y >= h) break; }
          }
          continue;
        }

        let shadeValue = (value << sm) + 24;
        let factor = shadeValue > 255 ? 1 : shadeValue / 255;

        for (let i = 0; i < count; i++) {
          if (y >= h) break;
          const offset = (y * w + x) * 4
          const existing = imageBuffer.readInt32BE(offset)
          const a = existing & 0xFF;
          if (a !== 0) {
            const r = Math.round((existing >>> 24 & 0xFF) * factor);
            const g = Math.round((existing >>> 16 & 0xFF) * factor);
            const b = Math.round((existing >>> 8 & 0xFF) * factor);
            imageBuffer.writeUInt8(r & 0xFF, offset)
            imageBuffer.writeUInt8(g & 0xFF, offset + 1)
            imageBuffer.writeUInt8(b & 0xFF, offset + 2)
            imageBuffer.writeUInt8(a & 0xFF, offset + 3)
          }
          x++;
          if (x >= w) { x = 0; y++; }
        }
      }
    }

    return await new Jimp({ data: imageBuffer, width: frame.w, height: frame.h }).getBuffer("image/png");
  }
}