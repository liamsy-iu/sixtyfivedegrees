import QRCode from 'qrcode'

export async function generateLotQrPng(lotCode: string): Promise<ArrayBuffer> {
  const url = `https://sixtyfivedegrees.com/lots/${lotCode}`
  const buffer = await QRCode.toBuffer(url, {
    type: 'png',
    width: 600,
    margin: 2,
    errorCorrectionLevel: 'M',
  })
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
}