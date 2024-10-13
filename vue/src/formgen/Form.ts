import type { FormInfos } from "@/Models";
import { jsPDF, type TableConfig } from "jspdf";
import autoTable from "jspdf-autotable";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);

const FONT_SIZE = 14;
const H1_FONT_SIZE = FONT_SIZE * 2;
const H2_FONT_SIZE = FONT_SIZE * 1.5;
const MY = 30;
const MX = 30;

const header = [
  "Fachbereich Inklusion, Diversität",
  "und Sonderpädagogik / Abt. Päd/1",
  "Bildungsdirektion Oberösterreich",
  "Sonnensteinstraße 11-13, 4040 Linz",
];

export const saveForm = async (formInfos: FormInfos) => {
  const pdf = new jsPDF({
    unit: "pt",
  }) as jsPDF & { lastAutoTable: any };

  // add fonts
  const corbel = await (await fetch("/Corbel.ttf.b64")).text();
  pdf.addFileToVFS("Corbel.ttf", corbel);
  pdf.addFont("Corbel.ttf", "Corbel", "normal");
  const corbelBold = await (await fetch("/Corbel-Bold.ttf.b64")).text();
  pdf.addFileToVFS("Corbel-Bold.ttf", corbelBold);
  pdf.addFont("Corbel-Bold.ttf", "Corbel", "bold");
  pdf.setFont("Corbel");

  // set up vars
  const pageHeight = pdf.internal.pageSize.height;
  const pageWidth = pdf.internal.pageSize.width;

  // header
  const logo = await loadImage("/bd_logo.png");
  const logo_size = 200;
  pdf.addImage(logo, "png", MX, MY - 0.43 * logo_size, logo_size, logo_size);

  pdf.setFont("Corbel", "bold");
  pdf.setFontSize(10);
  let letterHeadY = MY;
  const letterHeadX =
    pageWidth -
    MX -
    header.map((e) => pdf.getTextDimensions(e).w).sort((a, b) => b - a)[0];
  header.forEach((text, index) => {
    if (index >= 2) pdf.setFont("Corbel", "normal");
    pdf.text(text, letterHeadX, letterHeadY);
    letterHeadY += 10;
  });

  let y = MY + logo_size / 3;

  // student infos
  const data = [
    ["Name", formInfos.studentInfos.name],
    ["Geburtsdatum", formInfos.studentInfos.dateOfBirth],
  ];

  pdf.setFont("Corbel", "normal");
  pdf.setFontSize(FONT_SIZE);
  autoTable(pdf, {
    head: [],
    body: data,
    startY: y,
    margin: {
      left: MX,
      right: MX,
    },
    styles: {
      fontSize: FONT_SIZE,
    },
  });

  y = pdf.lastAutoTable.finalY + 2 * FONT_SIZE;

  // title
  y = addText(pdf, "Fördermaßnahmen", y, H1_FONT_SIZE, true);

  formInfos.categories.forEach((category) => {
    if (y + H2_FONT_SIZE * 1.5 > pageHeight - MY) {
      pdf.addPage();
      y = MY + H2_FONT_SIZE / 2;
    }
    y = addText(pdf, category.name, y, H2_FONT_SIZE, true);
    category.measures.forEach((measure) => {
      if (y + FONT_SIZE * 1.5 > pageHeight - MY) {
        pdf.addPage();
        y = MY + FONT_SIZE / 2;
      }
      y = addText(pdf, "\u2022 " + measure.name, y, FONT_SIZE);
    });
    y += H2_FONT_SIZE / 2;
  });

  if (formInfos.comment) {
    addText(pdf, "Anmerkungen", y, H2_FONT_SIZE, true);
    y += H2_FONT_SIZE;
    addText(pdf, formInfos.comment, y, FONT_SIZE);
    y += FONT_SIZE;
  }

  pdf.save("output.pdf");
};

function addText(
  pdf: jsPDF,
  text: string,
  y: number,
  fontSize: number,
  bold?: boolean,
): number {
  if (bold) {
    pdf.setFont("Corbel", "bold");
  } else {
    pdf.setFont("Corbel", "normal");
  }

  pdf.setFontSize(fontSize);
  pdf.text(text, MX, y);

  pdf.setFont("Corbel", "normal");
  pdf.setFontSize(FONT_SIZE);

  return y + fontSize;
}

async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = () => reject();
  });
}
