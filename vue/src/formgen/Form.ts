import { jsPDF } from "jspdf";

export const saveForm = async () => {
  const doc = new jsPDF();
  const corbel = await (await fetch("/Corbel.ttf.b64")).text();

  doc.addFileToVFS("Corbel.ttf", corbel);
  doc.addFont("Corbel.ttf", "Corbel", "normal");
  doc.setFont("Corbel");

  doc.text("Fördermaßnahmen", 10, 10);
  doc.save("a4.pdf");
};
