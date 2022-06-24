import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';

export async function generateQRDataUrl(
  username: string,
  issuer: string,
  secret: string
): Promise<string> {
  return await generateQR(authenticator.keyuri(username, issuer, secret));
}

async function generateQR(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error(err);
  }
}
