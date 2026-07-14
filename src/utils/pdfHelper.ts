import html2pdf from "html2pdf.js";

interface PDFOptions {
  title: string;
  subtitle?: string;
  tenantName?: string;
  tenantCode?: string;
  language: string;
}

export const downloadPDF = (elementId: string, filename: string, options: PDFOptions) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    return;
  }

  // Create a clean off-screen print-ready clone of the table
  const printWrapper = document.createElement("div");
  printWrapper.style.padding = "24px";
  printWrapper.style.backgroundColor = "#ffffff";
  printWrapper.style.fontFamily = "sans-serif";
  printWrapper.style.color = "#1e293b";
  printWrapper.style.width = "680px"; // Fits A4 portrait page width perfectly without cropping

  // Header Banner
  const header = document.createElement("div");
  header.style.marginBottom = "24px";
  header.style.paddingBottom = "24px";
  header.style.borderBottom = "2px solid #e2e8f0";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "flex-start";
  
  const headerLeft = document.createElement("div");
  headerLeft.innerHTML = `
    <h1 style="font-size: 24px; font-weight: bold; color: #0f172a; margin: 0;">${options.title}</h1>
    ${options.subtitle ? `<p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">${options.subtitle}</p>` : ""}
    <p style="font-size: 10px; color: #94a3b8; margin: 8px 0 0 0; font-family: monospace;">Date Generated: ${new Date().toLocaleString()}</p>
  `;

  const headerRight = document.createElement("div");
  headerRight.style.textAlign = "right";
  if (options.tenantName) {
    headerRight.innerHTML = `
      <h2 style="font-size: 14px; font-weight: 800; color: #2563eb; text-transform: uppercase; margin: 0;">${options.tenantName}</h2>
      ${options.tenantCode ? `<p style="font-size: 12px; color: #64748b; font-family: monospace; margin: 0;">Mill Code: ${options.tenantCode}</p>` : ""}
      <span style="display: inline-block; margin-top: 8px; padding: 2px 6px; background-color: #f1f5f9; color: #475569; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase;">
        Locale: ${options.language.toUpperCase()}
      </span>
    `;
  }

  header.appendChild(headerLeft);
  header.appendChild(headerRight);
  printWrapper.appendChild(header);

  // Content Area - clone the table container
  const content = element.cloneNode(true) as HTMLElement;
  
  // Clean up any interactive items we don't want in the PDF (e.g. search bars, action buttons, modals, dropdowns)
  const buttons = content.querySelectorAll("button, select, input, a, .no-print");
  buttons.forEach((btn) => btn.remove());

  // Remove any inline SVG icons to keep table data values clean and text-only
  const svgs = content.querySelectorAll("svg");
  svgs.forEach((svg) => svg.remove());

  // If there's an action header/column, strip it to look professional
  const thActions = content.querySelectorAll("th:last-child");
  thActions.forEach((th) => {
    if (th.textContent?.toLowerCase().includes("action") || th.textContent?.includes("कार्य") || th.textContent?.includes("کارروائی")) {
      th.remove();
    }
  });
  
  const tdActions = content.querySelectorAll("td:last-child");
  tdActions.forEach((td) => {
    // If it contains action buttons/icons, remove it
    if (td.querySelector("button") || td.querySelector("svg") || td.classList.contains("text-right")) {
      td.remove();
    }
  });

  // Recursive function to strip all classes (which prevents oklch color parsing errors)
  const cleanClasses = (node: HTMLElement) => {
    node.removeAttribute("class");
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        cleanClasses(child as HTMLElement);
      }
    });
  };
  cleanClasses(content);

  // Apply clean table printing styles inline to the cloned table
  const table = content.querySelector("table");
  if (table) {
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.fontSize = "10px";
    table.style.marginTop = "16px";
    table.style.fontFamily = "sans-serif";

    const rows = content.querySelectorAll("tr");
    rows.forEach((row: any, rowIndex) => {
      if (rowIndex % 2 === 0 && rowIndex > 0) {
        row.style.backgroundColor = "#f8fafc";
      }
    });

    const cells = content.querySelectorAll("th, td");
    cells.forEach((cell: any) => {
      cell.style.padding = "8px 6px";
      cell.style.borderBottom = "1px solid #e2e8f0";
      cell.style.textAlign = "left";
      cell.style.color = "#334155";
      cell.style.wordBreak = "break-word";
    });

    const headers = content.querySelectorAll("th");
    headers.forEach((h: any) => {
      h.style.backgroundColor = "#0f172a";
      h.style.color = "#ffffff";
      h.style.fontWeight = "bold";
      h.style.borderBottom = "2px solid #1e293b";
    });
  }

  printWrapper.appendChild(content);

  // Append temporary element to body to render it
  document.body.appendChild(printWrapper);

  const opt = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: "mm", format: "a4" as const, orientation: "portrait" as const },
  };

  html2pdf()
    .set(opt)
    .from(printWrapper)
    .save()
    .then(() => {
      // Remove temporary element
      document.body.removeChild(printWrapper);
    })
    .catch((err) => {
      console.error("PDF generation failed:", err);
      if (printWrapper.parentNode) {
        document.body.removeChild(printWrapper);
      }
    });
};
