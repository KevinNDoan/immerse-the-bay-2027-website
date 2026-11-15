/** The public address of the site. The QR codes point here, so set NEXT_PUBLIC_SITE_URL once deployed. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/** Where a judge lands after scanning the QR code. */
export const PAMPHLET_URL = `${SITE_URL}/pamphlet`;

/** The pre-built PDF of the pamphlet. */
export const PAMPHLET_PDF_PATH = "/zap-pamphlet.pdf";
