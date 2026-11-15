import "server-only";
import QRCode from "qrcode";

type QrOptions = {
  /** Colour of the modules. Defaults to white, for the void. */
  dark?: string;
  /** Colour behind the modules. Defaults to transparent. */
  light?: string;
  /** Quiet zone, in modules. */
  margin?: number;
};

/** An SVG QR code as markup, made on the server so the page ships no QR code library. */
export async function qrSvg(text: string, { dark = "#ffffff", light = "#00000000", margin = 1 }: QrOptions = {}): Promise<string> {
  return QRCode.toString(text, { type: "svg", errorCorrectionLevel: "M", margin, color: { dark, light } });
}

/** The same QR code as a PNG data URL, for the PDF. */
export async function qrPngDataUrl(text: string, { dark = "#0b0814", light = "#f2f0f7", margin = 1 }: QrOptions = {}): Promise<string> {
  return QRCode.toDataURL(text, { errorCorrectionLevel: "M", margin, width: 600, color: { dark, light } });
}
