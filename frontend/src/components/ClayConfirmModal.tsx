interface ClayConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ClayConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
  isLoading = false,
}: ClayConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="clay-card bg-white rounded-[2.5rem] max-w-xl w-full overflow-hidden shadow-2xl border border-white/60 flex flex-col md:flex-row animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Accent Panel: Visual Emblem */}
        <div className="w-full md:w-44 bg-gradient-to-br from-rose-50 to-rose-100/40 p-6 md:p-0 flex items-center justify-center border-b md:border-b-0 md:border-r border-rose-100/50 shrink-0">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-white shadow-[10px_10px_20px_0_rgba(225,29,72,0.08),inset_4px_4px_10px_0_rgba(255,255,255,0.9),inset_-4px_-4px_10px_0_rgba(225,29,72,0.05)] border border-rose-200/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-rose-600 text-3xl md:text-4xl font-bold animate-pulse">
              delete_forever
            </span>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="p-8 flex-grow flex flex-col justify-between">
          <div className="space-y-3">
            <span className="inline-block text-[10px] font-bold text-rose-600 uppercase tracking-[0.2em]">
              Tindakan Hapus
            </span>
            <h3 className="text-xl font-extrabold text-[#191c1e] tracking-tight">{title}</h3>
            <p className="text-sm text-[#464555] leading-relaxed font-medium">
              {message}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-8 justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-2.5 text-xs font-bold clay-btn-secondary min-w-[100px] w-full sm:w-auto order-2 sm:order-1"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-6 py-2.5 text-xs font-bold clay-btn-danger min-w-[120px] w-full sm:w-auto order-1 sm:order-2"
            >
              {isLoading ? 'Memproses...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
