import { useState } from "react";
import { Printer } from "lucide-react";

interface PrintBillModalProps {
  record: {
    id: string;
    type: "Purchase" | "Sale" | "Expense" | "Labour";
    name: string;
    itemName: string;
    amount: number;
    date: string;
    details: string;
  };
  onClose: () => void;
  tenant: {
    name: string;
    code: string;
    contactNumber?: string | null;
    email?: string | null;
    registerNumber?: string | null;
    state?: string | null;
    city?: string | null;
    townOrVillage?: string | null;
  } | null;
}

export default function PrintBillModal({ record, onClose, tenant }: PrintBillModalProps) {
  // Helper: extract quantity/unit from details string
  // Format is usually e.g., "Buyer (100 Bags)" or "Payment: Paid (100 Bags)"
  const extractQuantityAndUnit = (detailsStr: string) => {
    const match = detailsStr.match(/\((\d+(?:\.\d+)?)\s+([a-zA-Z\s]+)\)/);
    if (match) {
      return {
        quantity: parseFloat(match[1]),
        unit: match[2].trim(),
      };
    }
    return { quantity: 1, unit: "Units" };
  };

  const { quantity, unit } = extractQuantityAndUnit(record.details);

  // Editable bill states
  const [companyName, setCompanyName] = useState(tenant?.name || "Your Company Name");
  const [companyAddress, setCompanyAddress] = useState(
    tenant?.city
      ? `${tenant.townOrVillage || tenant.city}, ${tenant.state || ""}`
      : "90, west street, US"
  );
  const [companyPhone, setCompanyPhone] = useState(tenant?.contactNumber || "+01 12345 67890");

  const [partyName, setPartyName] = useState(record.name);
  const [partyAddress, setPartyAddress] = useState("123 Grain Market Yard, Sector 4, New Delhi, India");
  const [vehicleNumber, setVehicleNumber] = useState("DL-3C-AB-5678");
  const [otherCharges, setOtherCharges] = useState(500);
  const [otherChargesDesc, setOtherChargesDesc] = useState("Freight & Loading Charges");
  const [taxRate, setTaxRate] = useState(5); // Default 5% GST

  // Recalculations
  const baseSubtotal = record.amount;
  const taxableValue = baseSubtotal + otherCharges;
  const taxAmount = (taxableValue * taxRate) / 100;
  const grandTotal = taxableValue + taxAmount;

  const pricePerUnit = quantity > 0 ? baseSubtotal / quantity : baseSubtotal;

  const handlePrint = () => {
    const printContent = document.getElementById("invoice-print-area")?.innerHTML;
    const windowUrl = "about:blank";
    const uniqueName = new Date().getTime();
    const windowName = "Print" + uniqueName;
    const printWindow = window.open(
      windowUrl,
      windowName,
      "left=50,top=50,width=850,height=950,toolbar=0,scrollbars=1,status=0"
    );

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${record.id}</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">
            <style>
              @page {
                size: A4 portrait;
                margin: 20mm 15mm 20mm 15mm;
              }
              body {
                margin: 0;
                padding: 0;
                background: #f1f5f9;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              /* Control Bar */
              .control-bar {
                background-color: #0f172a;
                color: #ffffff;
                padding: 12px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-family: 'Inter', sans-serif;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              }
              .control-bar-title {
                font-weight: 800;
                font-size: 14px;
                letter-spacing: 0.05em;
              }
              .control-btn-group {
                display: flex;
                gap: 12px;
              }
              .control-btn-print {
                background-color: #ff8c00;
                color: #ffffff;
                border: none;
                padding: 8px 18px;
                border-radius: 6px;
                font-weight: 800;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: background-color 0.2s;
              }
              .control-btn-print:hover {
                background-color: #e07b00;
              }
              .control-btn-close {
                background-color: #475569;
                color: #ffffff;
                border: none;
                padding: 8px 18px;
                border-radius: 6px;
                font-weight: 800;
                cursor: pointer;
                font-size: 12px;
                transition: background-color 0.2s;
              }
              .control-btn-close:hover {
                background-color: #334155;
              }

              /* Print wrapper margin adjustments */
              .print-body-content {
                padding: 40px;
                background: #ffffff;
                display: flex;
                justify-content: center;
              }

              @media print {
                .control-bar {
                  display: none !important;
                }
                body {
                  background: #ffffff;
                }
                .print-body-content {
                  padding: 0;
                }
              }
            </style>
            <script>
              function triggerPrint() {
                window.print();
              }
              function closeBillWindow() {
                window.close();
              }
            </script>
          </head>
          <body>
            <div class="control-bar">
              <span class="control-bar-title">PRINT BILL PREVIEW</span>
              <div class="control-btn-group">
                <button class="control-btn-print" onclick="triggerPrint()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  <span>Print Document</span>
                </button>
                <button class="control-btn-close" onclick="closeBillWindow()">Close Window</button>
              </div>
            </div>
            <div class="print-body-content">
              <div style="width: 100%; max-width: 800px;">
                ${printContent}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
    }
  };

  const isPurchase = record.type === "Purchase";

  // Dynamic Item List HTML calculation based on charges
  const getTableRowsHtml = () => {
    let rowsHtml = `
      <tr>
        <td style="border-right: 1.5px solid #000000; padding: 12px 5px; text-align: center; height: 185px; vertical-align: top; font-weight: bold; color: #0f172a;">1</td>
        <td style="border-right: 1.5px solid #000000; padding: 12px 10px; text-align: left; height: 185px; vertical-align: top;">
          <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 4px;">${record.itemName}</div>
          <div style="font-size: 11px; color: #64748b; font-weight: 500;">${record.details}</div>
        </td>
        <td style="border-right: 1.5px solid #000000; padding: 12px 5px; text-align: center; height: 185px; vertical-align: top; font-weight: 700; color: #0f172a;">${quantity} ${unit}</td>
        <td style="border-right: 1.5px solid #000000; padding: 12px 5px; text-align: center; height: 185px; vertical-align: top; font-weight: 700; color: #0f172a;">Rs. ${pricePerUnit.toLocaleString("en-IN")}</td>
        <td style="padding: 12px 5px; text-align: center; height: 185px; vertical-align: top; font-weight: 800; color: #0f172a;">Rs. ${baseSubtotal.toLocaleString("en-IN")}</td>
      </tr>
    `;

    let sno = 2;
    if (otherCharges > 0) {
      rowsHtml += `
        <tr>
          <td style="border-right: 1.5px solid #000000; padding: 10px 5px; text-align: center; height: 35px; vertical-align: top; font-weight: bold; color: #0f172a;">${sno++}</td>
          <td style="border-right: 1.5px solid #000000; padding: 10px 10px; text-align: left; height: 35px; vertical-align: top;">
            <div style="font-weight: 800; font-size: 12px; color: #0f172a;">${otherChargesDesc}</div>
          </td>
          <td style="border-right: 1.5px solid #000000; padding: 10px 5px; text-align: center; height: 35px; vertical-align: top; font-weight: 700; color: #0f172a;">1</td>
          <td style="border-right: 1.5px solid #000000; padding: 10px 5px; text-align: center; height: 35px; vertical-align: top; font-weight: 700; color: #0f172a;">Rs. ${otherCharges.toLocaleString("en-IN")}</td>
          <td style="padding: 10px 5px; text-align: center; height: 35px; vertical-align: top; font-weight: 800; color: #0f172a;">Rs. ${otherCharges.toLocaleString("en-IN")}</td>
        </tr>
      `;
    }

    if (taxRate > 0) {
      rowsHtml += `
        <tr>
          <td style="border-right: 1.5px solid #000000; padding: 10px 5px; text-align: center; height: 35px; vertical-align: top; font-weight: bold; color: #0f172a;">${sno++}</td>
          <td style="border-right: 1.5px solid #000000; padding: 10px 10px; text-align: left; height: 35px; vertical-align: top;">
            <div style="font-weight: 800; font-size: 12px; color: #0f172a;">GST / Sales Tax (${taxRate}%)</div>
          </td>
          <td style="border-right: 1.5px solid #000000; padding: 10px 5px; text-align: center; height: 35px; vertical-align: top; font-weight: 700; color: #0f172a;">-</td>
          <td style="border-right: 1.5px solid #000000; padding: 10px 5px; text-align: center; height: 35px; vertical-align: top; font-weight: 700; color: #0f172a;">-</td>
          <td style="padding: 10px 5px; text-align: center; height: 35px; vertical-align: top; font-weight: 800; color: #0f172a;">Rs. ${taxAmount.toLocaleString("en-IN")}</td>
        </tr>
      `;
    }

    return rowsHtml;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Set strict fixed height h-[85vh] for the modal container so flex children can scroll correctly without getting cropped */}
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh]">
        {/* Left Side: Parameters Customizer */}
        <div className="w-full md:w-80 bg-slate-50 p-6 border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto shrink-0 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Bill Configuration</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Customize invoice details</p>
            </div>

            {/* Editable Company Profile */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-3">
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider block">Your Company details</span>
              <div className="space-y-2">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500 bg-white font-medium"
                />
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Company Address"
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500 bg-white font-medium"
                />
                <input
                  type="text"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="Company Phone"
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500 bg-white font-medium"
                />
              </div>
            </div>

            {/* Editable Party Name */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Party / Client Name</label>
              <input
                type="text"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white font-medium"
              />
            </div>

            {/* Editable Address */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Party Address</label>
              <textarea
                value={partyAddress}
                onChange={(e) => setPartyAddress(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white font-medium resize-none"
              />
            </div>

            {/* Editable Vehicle Number */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Vehicle Number</label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white font-medium"
              />
            </div>

            {/* Editable Extra Charges */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Other Charges (Rs)</label>
                <input
                  type="number"
                  value={otherCharges}
                  onChange={(e) => setOtherCharges(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Tax Rate (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white font-medium"
                />
              </div>
            </div>

            {/* Editable Extra Charges Desc */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Charges Description</label>
              <input
                type="text"
                value={otherChargesDesc}
                onChange={(e) => setOtherChargesDesc(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white font-medium"
              />
            </div>
          </div>

          <div className="pt-6 space-y-2">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#ff8c00] hover:bg-[#e07b00] text-white rounded-xl font-bold transition cursor-pointer text-xs"
            >
              <Printer size={15} />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition cursor-pointer text-xs"
            >
              Close Preview
            </button>
          </div>
        </div>

        {/* Right Side: Print Preview Area (p-6 changed to p-8, justify-start keeps it aligned from top, overflow-y-auto allows clean scroll) */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-100 flex flex-col items-center justify-start min-h-0">
          {/* mb-8 adds bottom margin spacer so the bottom part of the bill is NEVER cut off when scrolling down */}
          <div className="bg-white border-2 border-black w-full max-w-2xl shadow-xl overflow-hidden font-sans text-black mb-8 shrink-0" id="invoice-print-area">
            <style>{`
              .invoice-print-area-wrapper {
                font-family: 'Inter', sans-serif;
                color: #000000;
                background-color: #ffffff;
                box-sizing: border-box;
                width: 100%;
              }
              .print-pad-container {
                width: 100%;
                border: 2px solid #000000;
                overflow: hidden;
                box-sizing: border-box;
              }
              .orange-header-banner {
                background-color: #ff8c00 !important;
                color: #ffffff !important;
                padding: 16px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #000000;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                box-sizing: border-box;
              }
              .header-logo-container {
                width: 85px;
                height: 55px;
              }
              .header-center-info {
                flex: 1;
                text-align: center;
                margin: 0 15px;
              }
              .header-center-info h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #ffffff !important;
              }
              .header-center-info p {
                margin: 4px 0 0 0;
                font-size: 11px;
                font-weight: 500;
                color: #ffffff !important;
                opacity: 0.95;
              }
              .header-right-contact {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                font-size: 12px;
                font-weight: 700;
                color: #ffffff !important;
                white-space: nowrap;
              }
              .header-right-contact svg {
                margin-right: 6px;
              }
              .bill-details-subbar {
                text-align: center;
                padding: 6px 0;
                border-bottom: 2px solid #ff8c00;
                background-color: #ffffff !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .bill-details-subbar h2 {
                margin: 0;
                font-size: 14px;
                font-weight: 800;
                color: #ff8c00 !important;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              }
              .invoice-meta-grid {
                padding: 12px 20px;
                display: flex;
                justify-content: space-between;
                background-color: #fffaf0 !important;
                border-bottom: 1.5px solid #cbd5e1;
                font-size: 11px;
                line-height: 1.5;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                box-sizing: border-box;
              }
              .meta-customer-info {
                max-width: 60%;
                text-align: left;
              }
              .meta-customer-info h3 {
                margin: 0 0 4px 0;
                font-size: 9px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #64748b;
              }
              .meta-customer-info p.party-name-bold {
                margin: 0;
                font-size: 12px;
                font-weight: 900;
                color: #0f172a;
              }
              .meta-customer-info p.party-address-details {
                margin: 3px 0 0 0;
                font-size: 10.5px;
                color: #475569;
                font-weight: 500;
              }
              .meta-bill-info {
                text-align: right;
                align-self: center;
              }
              .meta-bill-info div {
                margin-bottom: 3px;
              }
              .meta-bill-info div:last-child {
                margin-bottom: 0;
              }
              .meta-label-gray {
                color: #64748b;
                font-weight: 600;
              }
              .meta-val-black {
                font-weight: 800;
                color: #0f172a;
                margin-left: 4px;
              }
              .meta-val-orange {
                font-weight: 800;
                color: #ff8c00 !important;
                margin-left: 4px;
              }
              .invoice-items-table {
                width: 100%;
                border-collapse: collapse;
                text-align: center;
              }
              .invoice-items-table th {
                font-size: 11px;
                font-weight: 800;
                color: #000000;
                padding: 8px 5px;
                border-bottom: 1.5px solid #000000;
                border-right: 1.5px solid #000000;
                text-transform: uppercase;
              }
              .invoice-items-table th:last-child {
                border-right: none;
              }
              .invoice-items-table td {
                padding: 10px 8px;
                font-size: 11.5px;
                border-right: 1.5px solid #000000;
                font-weight: 500;
                color: #000000;
              }
              .invoice-items-table td:last-child {
                border-right: none;
              }
              .invoice-total-bar {
                border-top: 1.5px solid #000000;
                border-bottom: 1.5px solid #000000;
                display: flex;
                width: 100%;
                background-color: #f8fafc !important;
                font-size: 12px;
                font-weight: 800;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .total-cell-spacer-sno {
                width: 8%;
                border-right: 1.5px solid #000000;
                padding: 6px 5px;
                box-sizing: border-box;
              }
              .total-cell-lbl {
                width: 54%;
                border-right: 1.5px solid #000000;
                padding: 6px 10px;
                text-align: right;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                box-sizing: border-box;
              }
              .total-cell-spacer-qty {
                width: 18%;
                border-right: 1.5px solid #000000;
                padding: 6px 5px;
                box-sizing: border-box;
              }
              .total-cell-spacer-rate {
                width: 16%;
                border-right: 1.5px solid #000000;
                padding: 6px 5px;
                box-sizing: border-box;
              }
              .total-cell-amount {
                width: 18%;
                padding: 6px 5px;
                text-align: center;
                font-weight: 900;
                color: #ff8c00 !important;
                font-size: 13px;
                box-sizing: border-box;
              }
              .invoice-terms-block {
                padding: 12px 20px;
                font-size: 10.5px;
                text-align: left;
              }
              .invoice-terms-block h4 {
                margin: 0;
                font-weight: 900;
                color: #0f172a;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              }
              .invoice-terms-block p {
                margin: 4px 0 0 0;
                color: #475569;
                line-height: 1.4;
                font-weight: 500;
              }
              .invoice-signature-block {
                display: flex;
                justify-content: flex-end;
                padding: 5px 20px 15px 20px;
              }
              .signature-inner-box {
                text-align: right;
              }
              .signature-draw-line {
                width: 150px;
                border-bottom: 1.5px solid #000000;
                margin-bottom: 5px;
                display: inline-block;
              }
              .signature-txt-title {
                font-size: 9px;
                font-weight: 800;
                color: #000000;
                text-transform: uppercase;
                margin: 0;
                padding-right: 10px;
              }
              .invoice-footer-banner {
                position: relative;
                background-color: #ff8c00 !important;
                height: 25px;
                margin-top: 10px;
                width: 100%;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .invoice-footer-arrow {
                position: absolute;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-bottom: 10px solid #ff8c00;
              }
            `}</style>
            <div className="invoice-print-area-wrapper">
              <div className="print-pad-container">
                {/* Colorful Orange Header Banner */}
                <div className="orange-header-banner">
                  {/* Shield Shape Logo SVG */}
                  <div className="header-logo-container">
                    <svg width="85" height="55" viewBox="0 0 85 55" className="block">
                      <path d="M 5 27 C 5 12, 80 12, 80 27 C 80 42, 5 42, 5 27 Z" fill="#ffffff" stroke="#ff8c00" strokeWidth="2.5"/>
                      <path d="M 9 27 C 9 15, 76 15, 76 27 C 76 39, 9 39, 9 27 Z" fill="none" stroke="#ff8c00" strokeWidth="1"/>
                      <text x="42" y="32" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="11" fill="#ff8c00" textAnchor="middle" letterSpacing="0.05em">LOGO</text>
                    </svg>
                  </div>

                  {/* Company Details */}
                  <div className="header-center-info">
                    <h1>{companyName}</h1>
                    <p>{companyAddress}</p>
                  </div>

                  {/* Contact details */}
                  <div className="header-right-contact">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                      <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/>
                    </svg>
                    <span>{companyPhone}</span>
                  </div>
                </div>

                {/* Bill Details Title */}
                <div className="bill-details-subbar">
                  <h2>Bill Details</h2>
                </div>

                {/* Invoice Meta Grid */}
                <div className="invoice-meta-grid">
                  <div className="meta-customer-info">
                    <h3>
                      {isPurchase ? "BILL FROM (SUPPLIER)" : "BILL TO (CLIENT)"}
                    </h3>
                    <p className="party-name-bold">Party Name: <span style={{ color: "#ff8c00" }}>{partyName}</span></p>
                    <p className="party-address-details">Address: {partyAddress}</p>
                  </div>
                  <div className="meta-bill-info">
                    <div><span className="meta-label-gray">Bill No:</span><span className="meta-val-black">{record.id.substring(0, 8).toUpperCase()}</span></div>
                    <div><span className="meta-label-gray">Date:</span><span className="meta-val-black">{record.date}</span></div>
                    <div><span className="meta-label-gray">Vehicle No:</span><span className="meta-val-orange">{vehicleNumber || "N/A"}</span></div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="table-section">
                  <table className="invoice-items-table">
                    <thead>
                      <tr>
                        <th style={{ width: "8%" }}>S.NO</th>
                        <th style={{ width: "44%" }}>Items</th>
                        <th style={{ width: "14%" }}>Quantity</th>
                        <th style={{ width: "16%" }}>Rate</th>
                        <th style={{ width: "18%" }}>Price</th>
                      </tr>
                    </thead>
                    <tbody dangerouslySetInnerHTML={{ __html: getTableRowsHtml() }} />
                  </table>
                </div>

                {/* Total Row */}
                <div className="invoice-total-bar" style={{ display: "grid", gridTemplateColumns: "8% 44% 14% 16% 18%" }}>
                  <div className="total-cell-spacer-sno"></div>
                  <div className="total-cell-lbl" style={{ width: "100%" }}>Total :</div>
                  <div className="total-cell-spacer-qty" style={{ width: "100%" }}></div>
                  <div className="total-cell-spacer-rate" style={{ width: "100%" }}></div>
                  <div className="total-cell-amount" style={{ width: "100%" }}>Rs. {grandTotal.toLocaleString("en-IN")}</div>
                </div>

                {/* Terms and Conditions */}
                <div className="invoice-terms-block">
                  <h4>Terms & Conditions :</h4>
                  <p>
                    1. Goods once sold will not be returned or exchanged.<br/>
                    2. In case of delay in payment, interest @ 18% p.a. will be charged.<br/>
                    3. All disputes are subject to local jurisdiction.
                  </p>
                </div>

                {/* Signature Block */}
                <div className="invoice-signature-block">
                  <div className="signature-inner-box">
                    <div className="signature-draw-line"></div>
                    <p className="signature-txt-title">Authorized Signature</p>
                  </div>
                </div>

                {/* Orange Footer Banner with Upward Arrow */}
                <div className="invoice-footer-banner">
                  <div className="invoice-footer-arrow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
