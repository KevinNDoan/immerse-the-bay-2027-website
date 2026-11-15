// The two-page US Letter leave-behind, rendered once at build time with @react-pdf/renderer.
// All copy comes from src/content/pitch.ts. @react-pdf/renderer is on Next's built-in
// serverExternalPackages list, so it needs no entry in next.config.ts.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Document, Font, Image as PdfImage, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { builtOn, close, pamphlet, product, questions, steps, whyXr, worlds } from "@/content/pitch";
import { qrPngDataUrl } from "@/lib/qr";
import { PAMPHLET_URL } from "@/lib/site";

// Build the file once at `next build` and serve it as a static asset.
export const dynamic = "force-static";

const VOID = "#07050d";
const PAPER = "#f2f0f7";
const INK = "#0b0814";
const INK_SOFT = "#4a4656"; // Ink at roughly 75% on Paper, still well above body contrast minimums
const WHITE_SOFT = "#cdcdcf"; // White at 80% on Void
const RULE = "#d6d3df";

const fontFile = (weight: number) =>
  path.join(process.cwd(), "node_modules/@fontsource/inter/files", `inter-latin-${weight}-normal.woff`);

let fontsReady = false;
function registerFonts() {
  if (fontsReady) return;
  Font.register({
    family: "Inter",
    fonts: [400, 500, 600, 700].map((fontWeight) => ({ src: fontFile(fontWeight), fontWeight })),
  });
  // Keep words whole; the default hyphenation splits short words awkwardly.
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

const MARGIN = 48;

const s = StyleSheet.create({
  page: { backgroundColor: PAPER, color: INK, fontFamily: "Inter", fontSize: 9.5, lineHeight: 1.4 },
  band: { backgroundColor: VOID, paddingTop: 38, paddingBottom: 28, paddingHorizontal: MARGIN },
  // wordmark.png is 1600 x 600 with transparent padding (16% left, 19% top and bottom); the negative
  // margins line the visible letters up with the text column.
  wordmark: { width: 190, height: 71.25, marginLeft: -30.4, marginTop: -13.3, marginBottom: -13.3 },
  headline: { color: "#ffffff", fontSize: 26, fontWeight: 700, lineHeight: 1.15, marginTop: 16 },
  intro: { color: WHITE_SOFT, fontSize: 11.5, lineHeight: 1.45, marginTop: 8, maxWidth: 440 },
  body: { paddingHorizontal: MARGIN, paddingTop: 24 },
  section: { marginBottom: 14 },
  h2: { fontSize: 15, fontWeight: 700, lineHeight: 1.2, marginBottom: 10 },
  lede: { fontSize: 10, lineHeight: 1.45, color: INK_SOFT, marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  cell2: { width: "48%", marginBottom: 12 },
  cell3: { width: "31%" },
  itemTitle: { fontSize: 11, fontWeight: 600, lineHeight: 1.25, marginBottom: 3 },
  itemText: { fontSize: 9.5, lineHeight: 1.42, color: INK_SOFT },
  rule: { borderTopWidth: 1, borderTopColor: RULE, paddingTop: 8 },
  page2: { paddingTop: 40, paddingHorizontal: MARGIN, paddingBottom: 36 },
  columns: { flexDirection: "row", justifyContent: "space-between" },
  column: { width: "48%" },
  qa: { marginBottom: 9 },
  q: { fontSize: 9.5, fontWeight: 600, lineHeight: 1.3, marginBottom: 2 },
  a: { fontSize: 9, lineHeight: 1.4, color: INK_SOFT },
  bottom: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, borderTopWidth: 1, borderTopColor: RULE, paddingTop: 16 },
  techRow: { marginBottom: 5 },
  techName: { fontSize: 9.5, fontWeight: 600, lineHeight: 1.3 },
  techRole: { fontSize: 9, lineHeight: 1.35, color: INK_SOFT },
  qrBox: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  qr: { width: 92, height: 92, marginLeft: -4 },
  qrCaption: { fontSize: 10, fontWeight: 600, lineHeight: 1.3 },
  qrUrl: { fontSize: 8.5, lineHeight: 1.35, color: INK_SOFT, marginTop: 2 },
  footer: {
    position: "absolute",
    left: MARGIN,
    right: MARGIN,
    bottom: 24,
    fontSize: 8.5,
    color: INK_SOFT,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function Footer({ page }: { page: number }) {
  return (
    <View style={s.footer} fixed>
      <Text>{pamphlet.footer}</Text>
      <Text>{`${page} of 2`}</Text>
    </View>
  );
}

function PamphletPdf({ wordmark, qr }: { wordmark: Buffer; qr: string }) {
  const half = Math.ceil(questions.length / 2);
  const questionColumns = [questions.slice(0, half), questions.slice(half)];

  return (
    <Document title={`${product.name} pamphlet`} author={product.name} subject={pamphlet.intro} language="en">
      <Page size="LETTER" style={s.page}>
        <View style={s.band}>
          <PdfImage style={s.wordmark} src={{ data: wordmark, format: "png" }} />
          <Text style={s.headline}>{product.headline}</Text>
          <Text style={s.intro}>{pamphlet.intro}</Text>
        </View>

        <View style={s.body}>
          <View style={s.section}>
            <Text style={s.h2}>{pamphlet.howTitle}</Text>
            <View style={s.grid}>
              {steps.map((step) => (
                <View key={step.title} style={[s.cell2, s.rule]}>
                  <Text style={s.itemTitle}>{step.title}</Text>
                  <Text style={s.itemText}>{step.text}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.h2}>{pamphlet.whyTitle}</Text>
            <View style={s.grid}>
              {whyXr.claims.map((claim) => (
                <View key={claim.title} style={[s.cell3, s.rule]}>
                  <Text style={s.itemTitle}>{claim.title}</Text>
                  <Text style={s.itemText}>{claim.text}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.h2}>{worlds.title}</Text>
            <Text style={s.lede}>{worlds.text}</Text>
            <View style={s.grid}>
              {worlds.points.map((point) => (
                <View key={point.title} style={[s.cell3, s.rule]}>
                  <Text style={s.itemTitle}>{point.title}</Text>
                  <Text style={s.itemText}>{point.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Footer page={1} />
      </Page>

      <Page size="LETTER" style={[s.page, s.page2]}>
        <Text style={s.h2}>{pamphlet.questionsTitle}</Text>
        <View style={s.columns}>
          {questionColumns.map((column, i) => (
            <View key={i} style={s.column}>
              {column.map((item) => (
                <View key={item.q} style={s.qa} wrap={false}>
                  <Text style={s.q}>{item.q}</Text>
                  <Text style={s.a}>{item.a}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={s.bottom} wrap={false}>
          <View style={s.column}>
            <Text style={s.h2}>{builtOn.title}</Text>
            {builtOn.items.map((item) => (
              <View key={item.name} style={s.techRow}>
                <Text style={s.techName}>{item.name}</Text>
                <Text style={s.techRole}>{item.role}</Text>
              </View>
            ))}
          </View>
          <View style={s.column}>
            <Text style={s.h2}>Track fit</Text>
            <Text style={s.itemText}>{builtOn.trackFit}</Text>
            <View style={s.qrBox}>
              <PdfImage style={s.qr} src={qr} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={s.qrCaption}>{close.qrCaption}</Text>
                <Text style={s.qrUrl}>{PAMPHLET_URL}</Text>
              </View>
            </View>
          </View>
        </View>
        <Footer page={2} />
      </Page>
    </Document>
  );
}

export async function GET() {
  registerFonts();
  const [wordmark, qr] = await Promise.all([
    readFile(path.join(process.cwd(), "public/art/wordmark.png")),
    qrPngDataUrl(PAMPHLET_URL),
  ]);
  const pdf = await renderToBuffer(<PamphletPdf wordmark={wordmark} qr={qr} />);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="zap-pamphlet.pdf"',
    },
  });
}
