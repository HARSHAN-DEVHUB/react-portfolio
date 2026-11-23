/** "01 / About ——————————— Harshan Babu" header row with a sharp rule line. */
export default function SectionHeader({ index, label, aside }) {
  return (
    <div className="flex items-center gap-4 border-t border-line pt-4">
      <span className="label text-ink">{String(index).padStart(2, "0")}</span>
      <span className="label">/ {label}</span>
      <span className="ml-auto label hidden sm:inline">{aside}</span>
    </div>
  );
}
