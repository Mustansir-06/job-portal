
const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#dfe4e9] border-t-[#173b57]"></div>

        <p className="text-sm font-medium text-[#687386]">
          Loading...
        </p>
      </div>
    </div>
  )
}

export default Loading

