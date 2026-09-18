const StatCard = ({ label, value, note }) => (
  <div className="border border-[#e2e6eb] bg-white p-5">
    <p className="text-sm text-[#687386]">{label}</p>
    <p className="mt-2 text-3xl font-semibold tracking-tight text-[#173b57]">{value}</p>
    {note && <p className="mt-2 text-xs text-[#8a94a3]">{note}</p>}
  </div>
)

export default StatCard