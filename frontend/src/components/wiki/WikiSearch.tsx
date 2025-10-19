interface WikiSearchProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function WikiSearch({ value, placeholder, onChange, onClear }: WikiSearchProps) {
  return (
    <div className="relative w-full md:w-80">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-700/40 bg-slate-900/70 px-5 py-2 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-2 flex items-center rounded-full px-2 text-xs font-semibold text-indigo-300 hover:text-indigo-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
