import { readFile } from "node:fs/promises";
import sharp from "sharp";

// public/favicon.svg is the single source; the raster icons are derived from it at build time.
// The light colour scheme is used, since raster images cannot follow prefers-color-scheme.
const loadSvg = () => readFile("public/favicon.svg");

export async function renderPng(size: number, background?: string): Promise<Buffer> {
    let image = sharp(await loadSvg(), { density: 300 }).resize(size, size);
    if (background) image = image.flatten({ background });
    return image.png().toBuffer();
}

// Builds a .ico with uncompressed 32-bit BMP entries (not PNG-in-ICO),
// so it also works in very old browsers and Windows versions.
export async function renderIco(sizes: number[]): Promise<Buffer> {
    const images = await Promise.all(sizes.map(async (size) => {
        const rgba = await sharp(await loadSvg(), { density: 300 })
            .resize(size, size)
            .ensureAlpha()
            .raw()
            .toBuffer();
        return bmpEntry(size, rgba);
    }));

    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // reserved
    header.writeUInt16LE(1, 2); // type: icon
    header.writeUInt16LE(sizes.length, 4);

    const directory = Buffer.alloc(16 * sizes.length);
    let offset = header.length + directory.length;
    sizes.forEach((size, i) => {
        const entry = i * 16;
        directory.writeUInt8(size >= 256 ? 0 : size, entry); // width (0 means 256)
        directory.writeUInt8(size >= 256 ? 0 : size, entry + 1); // height
        directory.writeUInt8(0, entry + 2); // palette size
        directory.writeUInt8(0, entry + 3); // reserved
        directory.writeUInt16LE(1, entry + 4); // colour planes
        directory.writeUInt16LE(32, entry + 6); // bits per pixel
        directory.writeUInt32LE(images[i].length, entry + 8);
        directory.writeUInt32LE(offset, entry + 12);
        offset += images[i].length;
    });

    return Buffer.concat([header, directory, ...images]);
}

// BITMAPINFOHEADER + bottom-up BGRA pixels + an all-zero AND mask (transparency comes from alpha).
function bmpEntry(size: number, rgba: Buffer): Buffer {
    const maskRowBytes = Math.ceil(size / 32) * 4;
    const pixels = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const src = (y * size + x) * 4;
            const dst = ((size - 1 - y) * size + x) * 4;
            pixels[dst] = rgba[src + 2];
            pixels[dst + 1] = rgba[src + 1];
            pixels[dst + 2] = rgba[src];
            pixels[dst + 3] = rgba[src + 3];
        }
    }
    const mask = Buffer.alloc(maskRowBytes * size);

    const info = Buffer.alloc(40);
    info.writeUInt32LE(40, 0); // header size
    info.writeInt32LE(size, 4); // width
    info.writeInt32LE(size * 2, 8); // height: XOR image + AND mask
    info.writeUInt16LE(1, 12); // planes
    info.writeUInt16LE(32, 14); // bits per pixel
    info.writeUInt32LE(0, 16); // no compression
    info.writeUInt32LE(pixels.length + mask.length, 20);

    return Buffer.concat([info, pixels, mask]);
}
