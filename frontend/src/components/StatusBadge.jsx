const StatusBadge = ({ status }) => {
  const styles = {
    applied: "bg-[#eef3f7] text-[#315a78]",
    shortlisted: "bg-[#f3eee8] text-[#9a6039]",
    interview: "bg-[#eeeaf4] text-[#66517f]",
    selected: "bg-[#eaf2ec] text-[#3f7d58]",
    rejected: "bg-[#f6ebeb] text-[#a24c4a]",
    withdrawn: "bg-[#f0f1f2] text-[#687386]",
    active: "bg-[#eaf2ec] text-[#3f7d58]",
    closed: "bg-[#f6ebeb] text-[#a24c4a]",
    draft: "bg-[#f0f1f2] text-[#687386]"
  }
  return <span className={`inline-flex px-2.5 py-1 text-xs font-medium capitalize ${styles[status] || styles.draft}`}>{status}</span>
}

export default StatusBadge