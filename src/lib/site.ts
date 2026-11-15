const configured = process.env.NEXT_PUBLIC_SITE_URL;

// The QR codes and the PDF bake this address in at build time. A production build without it
// would hand judges a code that points at localhost, so say so loudly.
if (!configured && process.env.NODE_ENV === "production") {
  console.warn(
    "\n[site] NEXT_PUBLIC_SITE_URL is not set. Every QR code and the pamphlet PDF will point to http://localhost:3000. Set it before building anything you print or deploy.\n",
  );
}

/** The public address of the site. The QR codes point here, so set NEXT_PUBLIC_SITE_URL once deployed. */
export const SITE_URL = (configured ?? "http://localhost:3000").replace(/\/+$/, "");

/** Where a judge lands after scanning the QR code. */
export const PAMPHLET_URL = `${SITE_URL}/pamphlet`;

/** The pre-built PDF of the pamphlet. */
export const PAMPHLET_PDF_PATH = "/zap-pamphlet.pdf";
