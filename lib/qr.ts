import QRCode from 'qrcode'

export async function generateLotQrPng(lotCode: string): Promise<Buffer> {
  const url = `https://sixtyfivedegrees.com/lots/${lotCode}`
  return QRCode.toBuffer(url, {
    type: 'png',
    width: 600,
    margin: 2,
    errorCorrectionLevel: 'M',
  })
}