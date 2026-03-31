interface Props {
  url: string;
  fileName: string;
  onClose: () => void;
}

export function FilePreview({ url, fileName, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full text-gray-800 font-bold text-lg flex items-center justify-center shadow-lg hover:bg-gray-100"
        >
          x
        </button>
        <img
          src={url}
          alt={fileName}
          className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
        />
        <p className="text-center text-white/70 text-sm mt-2">{fileName}</p>
      </div>
    </div>
  );
}
