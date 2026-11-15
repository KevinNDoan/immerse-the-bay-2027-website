// The overview as a one-page US Letter PDF, rendered once at build time with @react-pdf/renderer. It mirrors
// /pamphlet: a plain doc, Ink on white, with the QR code beside the title so a printed copy leads back online.
// All copy comes from src/content/pitch.ts. @react-pdf/renderer is on Next's built-in serverExternalPackages
// list, so it needs no entry in next.config.ts.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Document, Font, Image as PdfImage, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { builtOn, close, pamphlet, pamphletQuestions, product, steps, whyXr } from "@/content/pitch";
import { qrPngDataUrl } from "@/lib/qr";
import { PAMPHLET_URL } from "@/lib/site";

// Build the file once at `next build` and serve it as a static asset.
export const dynamic = "force-static";

const INK = "#0b0814";
const INK_SOFT = "#4a4656"; // Ink at roughly 75% on white, well above body contrast minimums

// Bricolage Grotesque, the design system's typeface, copied from ~/immerse-the-bay-2027 (SIL OFL, licence beside it).
const WEIGHTS = { 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold" } as const;
const fontFile = (weight: keyof typeof WEIGHTS) =>
  path.join(process.cwd(), "assets/fonts", `BricolageGrotesque-${WEIGHTS[weight]}.ttf`);

let fontsReady = false;
function registerFonts() {
  if (fontsReady) return;
  Font.register({
    family: "Bricolage Grotesque",
    fonts: ([400, 500, 600, 700] as const).map((fontWeight) => ({ src: fontFile(fontWeight), fontWeight })),
  });
  // Keep words whole; the default hyphenation splits short words awkwardly.
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

const s = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: INK,
    fontFamily: "Bricolage Grotesque",
    fontSize: 9,
    lineHeight: 1.38,
    paddingTop: 34,
    paddingBottom: 36,
    paddingHorizontal: 54,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  // zap-wordmark.png is 819 x 340 with an 8 px clear margin; the negative margin lines its letters up with the text.
  wordmark: { width: 113, height: 47, marginLeft: -2, marginBottom: 2 },
  subtitle: { fontSize: 10, color: INK_SOFT, marginTop: 4 },
  h2: { fontSize: 12, fontWeight: 700, lineHeight: 1.25, marginTop: 10, marginBottom: 4 },
  body: { fontSize: 9, lineHeight: 1.38 },
  h2Lead: { fontSize: 9.5, fontWeight: 400, color: INK_SOFT },
  bold: { fontWeight: 600 },
  soft: { color: INK_SOFT },
  item: { flexDirection: "row", marginBottom: 2 },
  marker: { width: 13, color: INK_SOFT },
  // A short rule instead of a bullet dot, per the house style.
  dash: { width: 6, height: 1, backgroundColor: INK_SOFT, marginTop: 6, marginRight: 7 },
  itemText: { flex: 1 },
  columns: { flexDirection: "row", justifyContent: "space-between" },
  column: { width: "48.5%" },
  qa: { marginBottom: 6 },
  techRow: { flexDirection: "row", marginBottom: 2 },
  techName: { width: 140, fontWeight: 600 },
  // The QR code sits top right, beside the title, so a printed copy leads back online.
  qrBox: { alignItems: "center", marginTop: -4, marginRight: -4 },
  qr: { width: 62, height: 62 },
  qrCaption: { fontSize: 7.5, color: INK_SOFT, marginTop: 1 },
});

function List({ items, numbered }: { items: readonly { title: string; text: string }[]; numbered?: boolean }) {
  return (
    <View>
      {items.map((it, i) => (
        <View key={it.title} style={s.item} wrap={false}>
          {numbered ? <Text style={s.marker}>{`${i + 1}.`}</Text> : <View style={s.dash} />}
          <Text style={s.itemText}>
            <Text style={s.bold}>{it.title}.</Text> {it.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

function OverviewPdf({ qr, wordmark }: { qr: string; wordmark: Buffer }) {
  const half = Math.ceil(pamphletQuestions.length / 2);
  const questionColumns = [pamphletQuestions.slice(0, half), pamphletQuestions.slice(half)];

  return (
    <Document title={pamphlet.title} author={product.name} subject={pamphlet.subtitle} language="en">
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          <View style={{ flex: 1, paddingRight: 24 }}>
            <PdfImage style={s.wordmark} src={{ data: wordmark, format: "png" }} />
            <Text style={s.subtitle}>{pamphlet.subtitle}</Text>
          </View>
          <View style={s.qrBox}>
            <PdfImage style={s.qr} src={qr} />
            <Text style={s.qrCaption}>{close.qrCaption}</Text>
          </View>
        </View>

        <Text style={s.h2}>{pamphlet.whatTitle}</Text>
        <Text style={s.body}>{`${product.headline} ${pamphlet.intro}`}</Text>

        {/* The lead sits beside the heading, so the page still fits one sheet. */}
        <Text style={s.h2}>
          {pamphlet.whyTitle} <Text style={s.h2Lead}>{pamphlet.whyLead}</Text>
        </Text>
        <List items={whyXr.claims} />

        <Text style={s.h2}>{pamphlet.howTitle}</Text>
        <List items={steps} numbered />

        <Text style={s.h2}>{pamphlet.questionsTitle}</Text>
        <View style={s.columns}>
          {questionColumns.map((column, i) => (
            <View key={i} style={s.column}>
              {column.map((q) => (
                <View key={q.q} style={s.qa} wrap={false}>
                  <Text style={s.bold}>{q.q}</Text>
                  <Text style={s.soft}>{q.a}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text style={s.h2}>{pamphlet.techTitle}</Text>
        {builtOn.items.map((item) => (
          <View key={item.name} style={s.techRow}>
            <Text style={s.techName}>{item.name}</Text>
            <Text style={[s.soft, { flex: 1 }]}>{item.role}</Text>
          </View>
        ))}

        <Text style={s.h2}>{pamphlet.trackTitle}</Text>
        <Text style={s.body}>{builtOn.trackFit}</Text>
      </Page>
    </Document>
  );
}

export async function GET() {
  registerFonts();
  const [qr, wordmark] = await Promise.all([
    qrPngDataUrl(PAMPHLET_URL, { dark: INK, light: "#ffffff" }),
    readFile(path.join(process.cwd(), "public/art/zap-wordmark.png")),
  ]);
  const pdf = await renderToBuffer(<OverviewPdf qr={qr} wordmark={wordmark} />);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="zap-overview.pdf"',
    },
  });
}
