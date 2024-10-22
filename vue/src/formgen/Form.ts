import type { FormInfos } from "@/Models";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);

const FONT_SIZE = 14;
const H1_FONT_SIZE = FONT_SIZE * 2;
const H2_FONT_SIZE = FONT_SIZE * 1.5;
const H3_FONT_SIZE = FONT_SIZE * 1.2;
const MY = 30;
const MX = 30;

const header = [
  "Fachbereich Inklusion, Diversität",
  "und Sonderpädagogik / Abt. Päd/1",
  "Bildungsdirektion Oberösterreich",
  "Sonnensteinstraße 11-13, 4040 Linz",
];

let logo: HTMLImageElement | null = null;

export const saveForm = async (formInfos: FormInfos) => {
  const pdf = new jsPDF({
    unit: "pt",
  }) as jsPDF & { lastAutoTable: any };

  // load assets
  logo = await loadImage("/bd_logo.png");
  const corbel = await (await fetch("/Corbel.ttf.b64")).text();
  const corbelBold = await (await fetch("/Corbel-Bold.ttf.b64")).text();

  // add fonts
  pdf.addFileToVFS("Corbel.ttf", corbel);
  pdf.addFont("Corbel.ttf", "Corbel", "normal");
  pdf.addFileToVFS("Corbel-Bold.ttf", corbelBold);
  pdf.addFont("Corbel-Bold.ttf", "Corbel", "bold");
  pdf.setFont("Corbel");

  // header
  let y = makeHeader(pdf);

  // student infos
  const data = [
    ["Name", formInfos.studentInfos.name ?? ""],
    ["Geburtsdatum", formInfos.studentInfos.dateOfBirth ?? ""],
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

  // content
  formInfos.categories.forEach((category) => {
    y = addText(pdf, category.name, y, H2_FONT_SIZE, true);
    category.subcategories.forEach((subcategory) => {
      y = addText(pdf, subcategory.name, y, H3_FONT_SIZE, true);
      subcategory.measures.forEach((measure) => {
        y = addText(pdf, "\u2022 " + measure.name, y, FONT_SIZE);
      });
      y += FONT_SIZE / 2;
    });

    if (category.comment && category.comment !== "") {
      y = addText(pdf, "Anmerkungen", y, H3_FONT_SIZE, true);
      y = addText(pdf, category.comment, y, FONT_SIZE);
    }
    y += H2_FONT_SIZE / 2;
  });

  pdf.save("output.pdf");
};

function addText(
  pdf: jsPDF,
  text: string,
  y: number,
  fontSize: number,
  bold?: boolean,
): number {
  setFont(pdf, fontSize, bold);
  const splittedText: string[] = pdf.splitTextToSize(
    text,
    pdf.internal.pageSize.width - 2 * MX,
  );

  splittedText.forEach((line) => {
    if (y + fontSize > pdf.internal.pageSize.height - MY) {
      pdf.addPage();
      y = makeHeader(pdf);
    }
    setFont(pdf, fontSize, bold);
    pdf.text(line, MX, y);
    y += fontSize;
  });

  setFont(pdf, FONT_SIZE, false);
  return y;
}

function setFont(pdf: jsPDF, fontSize: number, bold?: boolean) {
  if (bold) {
    pdf.setFont("Corbel", "bold");
  } else {
    pdf.setFont("Corbel", "normal");
  }
  pdf.setFontSize(fontSize);
}

async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = () => reject();
  });
}

function makeHeader(pdf: jsPDF): number {
  const logo_size = 200;
  pdf.addImage(logo!, "png", MX, MY - 0.43 * logo_size, logo_size, logo_size);

  pdf.setFont("Corbel", "bold");
  pdf.setFontSize(10);
  let letterHeadY = MY;
  const letterHeadX =
    pdf.internal.pageSize.width -
    MX -
    header.map((e) => pdf.getTextDimensions(e).w).sort((a, b) => b - a)[0];
  header.forEach((text, index) => {
    if (index >= 2) pdf.setFont("Corbel", "normal");
    pdf.text(text, letterHeadX, letterHeadY);
    letterHeadY += 10;
  });

  return MY + logo_size / 3;
}
