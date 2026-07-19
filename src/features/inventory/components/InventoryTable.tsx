import React from "react";
import { Edit2, Trash2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InventoryTableProps {
  filteredRecords: any[];
  isPartner: boolean;
  onEdit: (rec: any) => void;
  onDelete: (id: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  filteredRecords,
  isPartner,
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-center border-collapse min-w-[1150px]" id="inventory-table-container">
          <thead>
            <tr className="border-b border-slate-200/60 text-slate-700 text-xs font-extrabold uppercase tracking-wider bg-slate-50/80">
              <th className="px-6 py-4 whitespace-nowrap text-center">{t("item_name")}</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">{t("category")}</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">{t("stock_quantity")}</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">{t("min_stock_alert")}</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
              {!isPartner && <th className="px-6 py-4 text-center whitespace-nowrap">Actions</th>}
            </tr>
          </thead>
          <tbody className="text-sm font-medium text-slate-655">
            {filteredRecords.map((rec, idx) => {
              const isLowStock = rec.stockQuantity <= rec.minStockAlert;
              return (
                <tr 
                  key={rec.id} 
                  className={`hover:bg-slate-100/50 transition-colors border-b border-slate-100/60 ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  }`}
                >
                  <td className="px-6 py-4 font-sans font-bold text-slate-800 whitespace-nowrap text-center">
                    {rec.itemName}
                  </td>
                  <td className="px-6 py-4 font-sans text-slate-650 whitespace-nowrap text-center">
                    {rec.category}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-700 whitespace-nowrap text-center">
                    {rec.stockQuantity} <span className="text-xs text-slate-400 font-sans font-normal">{rec.unit}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600 whitespace-nowrap text-center">
                    {rec.minStockAlert} <span className="text-xs text-slate-400 font-sans font-normal">{rec.unit}</span>
                  </td>
                  <td className="px-6 py-4 font-bold font-sans whitespace-nowrap text-center">
                    {isLowStock ? (
                      <span className="text-red-600 inline-flex items-center justify-center font-extrabold animate-pulse">
                        <AlertCircle size={13} className="mr-1 text-red-500 shrink-0" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-emerald-600">Normal</span>
                    )}
                  </td>
                  {!isPartner && (
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => onEdit(rec)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer border border-transparent"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(rec.id)}
                          className="p-1.5 text-slate-400 hover:text-red-655 hover:bg-red-50 rounded-lg transition cursor-pointer border border-transparent"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
