import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  isConfirming = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with premium glassmorphism and blur effect */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onCancel}
      />

      {/* Modal Content Card */}
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 ease-out z-10">
        
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-50 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Warning Icon & Text Block */}
        <div className="flex items-start space-x-4">
          <div className="shrink-0 p-3 bg-red-50 rounded-xl text-red-600 border border-red-100">
            <AlertTriangle size={24} />
          </div>
          
          <div className="space-y-2 flex-1">
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isConfirming}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-md shadow-red-200 transition cursor-pointer flex items-center space-x-1.5 disabled:opacity-70"
          >
            {isConfirming ? (
              <>
                <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
export default ConfirmModal;
