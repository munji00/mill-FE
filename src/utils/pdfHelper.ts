import html2pdf from "html2pdf.js";

interface PDFOptions {
  title: string;
  subtitle?: string;
  tenantName?: string;
  tenantCode?: string;
  language: string;
  orientation?: "portrait" | "landscape";
}

export const downloadPDF = (elementId: string, filename: string, options: PDFOptions) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    return;
  }

  const orientation = options.orientation || "portrait";
  // landscape gets a wider container for more columns, portrait fits standard width
  const printWidth = orientation === "landscape" ? "1020px" : "780px";

  // Create a clean off-screen print-ready clone of the table
  const printWrapper = document.createElement("div");
  printWrapper.style.padding = "32px";
  printWrapper.style.backgroundColor = "#ffffff";

  // Load Google Fonts Inter stylesheet
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
  printWrapper.appendChild(fontLink);

  printWrapper.style.fontFamily = "'Inter', sans-serif";
  printWrapper.style.color = "#1e293b";
  printWrapper.style.width = printWidth;
  printWrapper.style.boxSizing = "border-box";
  
  // CRITICAL: Force background colors in PDF output
  printWrapper.style.printColorAdjust = "exact";
  (printWrapper.style as any).webkitPrintColorAdjust = "exact";

  // Header Banner
  const header = document.createElement("div");
  header.style.marginBottom = "24px";
  header.style.paddingBottom = "24px";
  header.style.borderBottom = "2.5px solid #0f172a";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "flex-start";
  
  const headerLeft = document.createElement("div");
  headerLeft.innerHTML = `
    <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.025em; font-family: 'Inter', sans-serif;">${options.title}</h1>
    ${options.subtitle ? `<p style="font-size: 13px; color: #475569; margin: 6px 0 0 0; font-weight: 500; font-family: 'Inter', sans-serif;">${options.subtitle}</p>` : ""}
    <p style="font-size: 10px; color: #64748b; margin: 10px 0 0 0; font-family: monospace;">Date Generated: ${new Date().toLocaleString()}</p>
  `;

  const headerRight = document.createElement("div");
  headerRight.style.textAlign = "right";
  if (options.tenantName) {
    headerRight.innerHTML = `
      <h2 style="font-size: 15px; font-weight: 900; color: #2563eb; text-transform: uppercase; margin: 0; letter-spacing: 0.05em; font-family: 'Inter', sans-serif;">${options.tenantName}</h2>
      ${options.tenantCode ? `<p style="font-size: 12px; color: #475569; font-family: monospace; margin: 4px 0 0 0; font-weight: bold;">Mill Code: ${options.tenantCode}</p>` : ""}
      <span style="display: inline-block; margin-top: 10px; padding: 3px 8px; background-color: #f1f5f9; color: #475569; border-radius: 6px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Inter', sans-serif;">
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
    const text = th.textContent?.toLowerCase() || "";
    if (text.includes("action") || text.includes("कार्य") || text.includes("کارروائی") || text.includes("actions")) {
      th.remove();
    }
  });
  
  const tdActions = content.querySelectorAll("td:last-child");
  tdActions.forEach((td) => {
    // If it contains action buttons or icons, remove it
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
  const table = content.tagName.toLowerCase() === "table" ? content : content.querySelector("table");
  if (table) {
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    // Slightly smaller font for landscape to allow more space, or portrait standard
    table.style.fontSize = orientation === "landscape" ? "10px" : "9.5px";
    table.style.marginTop = "16px";
    table.style.fontFamily = "'Inter', sans-serif";

    // Alternate row backgrounds
    const rows = content.querySelectorAll("tr");
    rows.forEach((row: any, rowIndex) => {
      if (rowIndex > 0) {
        row.style.backgroundColor = rowIndex % 2 === 0 ? "#f8fafc" : "#ffffff";
      }
    });

    // Style table cells (headers and data cells)
    const cells = content.querySelectorAll("th, td");
    cells.forEach((cell: any) => {
      cell.style.padding = "10px 8px";
      cell.style.border = "1px solid #cbd5e1";
      cell.style.textAlign = "center"; // Centered cells for clean spreadsheet layout
      cell.style.color = "#1e293b";
      cell.style.verticalAlign = "middle";
    });

    // Header styling
    const headers = content.querySelectorAll("th");
    headers.forEach((h: any) => {
      h.style.backgroundColor = "#0f172a"; // Dark navy header
      h.style.color = "#ffffff";
      h.style.fontWeight = "800";
      h.style.border = "1px solid #0f172a";
      h.style.fontSize = "10.5px";
      h.style.textTransform = "uppercase";
      h.style.letterSpacing = "0.025em";
    });

    // Control cell content wrapping for readability
    rows.forEach((row: any) => {
      const rowCells = row.querySelectorAll("th, td");
      rowCells.forEach((c: any, colIdx: number) => {
        // Prevent Date, Ledger Type, and Amount columns from wrapping
        if (colIdx === 0 || colIdx === 1 || colIdx === 4) {
          c.style.whiteSpace = "nowrap";
        } else {
          c.style.wordBreak = "break-word";
        }
      });
    });
  }

  printWrapper.appendChild(content);

  // Append temporary element to body to render it
  document.body.appendChild(printWrapper);

  const opt = {
    margin: 8,
    filename: `${filename}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: "mm", format: "a4" as const, orientation: orientation },
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
