import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useApi } from "../../api/axios"


const AIAssistant = () => {

  // ========================================
  // UI STATE
  // ========================================

  const [open, setOpen] = useState(false)


  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  })


  const [dragging, setDragging] = useState(false)


  const [startPosition, setStartPosition] = useState({
    x: 0,
    y: 0,
  })


  // ========================================
  // MESSAGE STATE
  // ========================================

  const [message, setMessage] = useState("")


  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm your Job Portal Assistant. I can help you find jobs, understand applications, and get information about your account.",
    },
  ])


  // ========================================
  // JOB CONTEXT
  // ========================================

  const [jobContext, setJobContext] = useState([])


  // ========================================
  // LOADING
  // ========================================

  const [loading, setLoading] = useState(false)


  const api = useApi()



  // ========================================
  // DRAG START
  // ========================================

  const handleMouseDown = (e) => {

    setDragging(true)


    setStartPosition({

      x:
        e.clientX -
        position.x,

      y:
        e.clientY -
        position.y,
    })
  }



  // ========================================
  // DRAG EVENTS
  // ========================================

  useEffect(() => {

    const handleMouseMove = (e) => {

      if (!dragging) {
        return
      }


      setPosition({

        x:
          e.clientX -
          startPosition.x,

        y:
          e.clientY -
          startPosition.y,
      })
    }


    const handleMouseUp = () => {

      setDragging(false)
    }


    window.addEventListener(
      "mousemove",
      handleMouseMove
    )


    window.addEventListener(
      "mouseup",
      handleMouseUp
    )


    return () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      )


      window.removeEventListener(
        "mouseup",
        handleMouseUp
      )
    }

  }, [
    dragging,
    startPosition
  ])



  // ========================================
  // SEND MESSAGE
  // ========================================

  const sendMessage = async () => {

    if (
      !message.trim() ||
      loading
    ) {
      return
    }


    const userMessage =
      message.trim()


    // ----------------------------------------
    // Add user message
    // ----------------------------------------

    const updatedMessages = [

      ...messages,

      {
        role: "user",
        content: userMessage,
      },

    ]


    setMessages(
      updatedMessages
    )


    setMessage("")


    setLoading(true)


    try {

      // --------------------------------------
      // Send chat + previous job context
      // --------------------------------------

      const res =
        await api.post(
          "/ai/chat",
          {
            messages:
              updatedMessages,

            jobContext:
              jobContext,
          }
        )


      // --------------------------------------
      // Add AI response
      // --------------------------------------

      setMessages(
        (prev) => [
          ...prev,

          {
            role: "assistant",

            content:
              res.data.reply,
          },
        ]
      )


      // --------------------------------------
      // Update job context
      // --------------------------------------

      if (
        Array.isArray(
          res.data.jobContext
        )
      ) {

        setJobContext(
          res.data.jobContext
        )
      }

    } catch (error) {

      console.log(
        error
      )
      const errorMessage =
        error.response?.status === 401
            ? "Please log in to use this feature."
            : "Sorry, something went wrong. Please try again."


      setMessages(
        (prev) => [
          ...prev,

          {
            role: "assistant",

            content:
              errorMessage,
          },
        ]
      )

    } finally {

      setLoading(false)
    }
  }



  // ========================================
  // SUGGESTION
  // ========================================

  const handleSuggestion = (text) => {

    setMessage(text)
  }



  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="fixed bottom-6 right-6 z-50">


      {/* ================================== */}
      {/* CHAT WINDOW */}
      {/* ================================== */}

      {open && (

        <div
          className="absolute bottom-16 right-0 flex h-[480px] w-[360px] flex-col border border-[#e2e6eb] bg-white shadow-xl"
          style={{
            transform:
              `translate(${position.x}px, ${position.y}px)`,
          }}
        >


          {/* ================================ */}
          {/* HEADER */}
          {/* ================================ */}

          <div
            onMouseDown={
              handleMouseDown
            }
            className="flex cursor-move items-center justify-between border-b border-[#e2e6eb] px-4 py-3"
          >

            <div>

              <h2 className="text-sm font-semibold text-[#173b57]">
                Job Assistant
              </h2>


              <p className="text-xs text-[#687386]">
                Your personal job portal assistant
              </p>

            </div>


            <button
              onMouseDown={
                (e) =>
                  e.stopPropagation()
              }
              onClick={() =>
                setOpen(false)
              }
              className="text-lg text-[#687386] hover:text-[#173b57]"
            >
              ×
            </button>

          </div>



          {/* ================================ */}
          {/* MESSAGES */}
          {/* ================================ */}

          <div className="flex-1 overflow-y-auto p-4">

            <div className="space-y-3">


              {messages.map(
                (msg, index) => (

                  <div
                    key={index}
                    className={`
                      max-w-[85%]
                      border
                      p-3
                      ${
                        msg.role === "user"
                          ? "ml-auto border-[#ead5ca] bg-[#fff7f3]"
                          : "border-[#e2e6eb] bg-[#f7f8fa]"
                      }
                    `}
                  >

                    <div className="min-w-0 text-sm leading-6 text-[#334155]">

                      <ReactMarkdown
                        remarkPlugins={[
                          remarkGfm
                        ]}
                        components={{

                          p:
                            ({ children }) => (
                              <p className="mb-2 last:mb-0">
                                {children}
                              </p>
                            ),


                          strong:
                            ({ children }) => (
                              <strong className="font-semibold text-[#173b57]">
                                {children}
                              </strong>
                            ),


                          em:
                            ({ children }) => (
                              <em>
                                {children}
                              </em>
                            ),


                          h1:
                            ({ children }) => (
                              <h1 className="mb-2 text-base font-semibold text-[#173b57]">
                                {children}
                              </h1>
                            ),


                          h2:
                            ({ children }) => (
                              <h2 className="mb-2 text-sm font-semibold text-[#173b57]">
                                {children}
                              </h2>
                            ),


                          h3:
                            ({ children }) => (
                              <h3 className="mb-2 text-sm font-semibold text-[#173b57]">
                                {children}
                              </h3>
                            ),


                          ul:
                            ({ children }) => (
                              <ul className="mb-2 list-disc space-y-1 pl-5">
                                {children}
                              </ul>
                            ),


                          ol:
                            ({ children }) => (
                              <ol className="mb-2 list-decimal space-y-1 pl-5">
                                {children}
                              </ol>
                            ),


                          li:
                            ({ children }) => (
                              <li>
                                {children}
                              </li>
                            ),


                          blockquote:
                            ({ children }) => (
                              <blockquote className="my-2 border-l-2 border-[#c9572b] pl-3 text-[#687386]">
                                {children}
                              </blockquote>
                            ),


                          table:
                            ({ children }) => (
                              <div className="my-3 max-w-full overflow-x-auto">

                                <table className="min-w-full border-collapse text-xs">

                                  {children}

                                </table>

                              </div>
                            ),


                          thead:
                            ({ children }) => (
                              <thead>
                                {children}
                              </thead>
                            ),


                          tbody:
                            ({ children }) => (
                              <tbody>
                                {children}
                              </tbody>
                            ),


                          tr:
                            ({ children }) => (
                              <tr>
                                {children}
                              </tr>
                            ),


                          th:
                            ({ children }) => (
                              <th className="whitespace-nowrap border border-[#e2e6eb] bg-[#f7f8fa] px-2 py-2 text-left font-semibold text-[#173b57]">
                                {children}
                              </th>
                            ),


                          td:
                            ({ children }) => (
                              <td className="border border-[#e2e6eb] px-2 py-2 align-top text-[#334155]">
                                {children}
                              </td>
                            ),


                          code:
                            ({ children }) => (
                              <code className="rounded bg-[#eef1f4] px-1 py-0.5 text-xs">
                                {children}
                              </code>
                            ),


                          pre:
                            ({ children }) => (
                              <pre className="my-2 overflow-x-auto bg-[#eef1f4] p-2 text-xs">
                                {children}
                              </pre>
                            ),


                          a:
                            ({ children, href }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#c9572b] underline"
                              >
                                {children}
                              </a>
                            ),


                          hr:
                            () => (
                              <hr className="my-3 border-[#e2e6eb]" />
                            ),

                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>

                    </div>

                  </div>

                )
              )}



              {/* ============================== */}
              {/* LOADING */}
              {/* ============================== */}

              {loading && (

                <div className="max-w-[85%] border border-[#e2e6eb] bg-[#f7f8fa] p-3">

                  <p className="text-sm text-[#687386]">
                    Thinking...
                  </p>

                </div>

              )}

            </div>



            {/* ================================ */}
            {/* SUGGESTIONS */}
            {/* ================================ */}

            {messages.length === 1 && (

              <div className="mt-5">

                <p className="mb-3 text-xs font-medium text-[#687386]">
                  Try asking
                </p>


                <div className="space-y-2">


                  <button
                    onClick={() =>
                      handleSuggestion(
                        "Find React jobs in Pune"
                      )
                    }
                    className="block w-full border border-[#e2e6eb] px-3 py-2 text-left text-sm text-[#173b57] hover:bg-[#f7f8fa]"
                  >
                    Find React jobs in Pune
                  </button>



                  <button
                    onClick={() =>
                      handleSuggestion(
                        "What is my application status?"
                      )
                    }
                    className="block w-full border border-[#e2e6eb] px-3 py-2 text-left text-sm text-[#173b57] hover:bg-[#f7f8fa]"
                  >
                    What is my application status?
                  </button>



                  <button
                    onClick={() =>
                      handleSuggestion(
                        "Show me suitable internships"
                      )
                    }
                    className="block w-full border border-[#e2e6eb] px-3 py-2 text-left text-sm text-[#173b57] hover:bg-[#f7f8fa]"
                  >
                    Show me suitable internships
                  </button>

                </div>

              </div>

            )}

          </div>



          {/* ================================ */}
          {/* INPUT */}
          {/* ================================ */}

          <div className="border-t border-[#e2e6eb] p-3">

            <div className="flex items-center gap-2 border border-[#dfe4e9] px-3 py-2">

              <input
                type="text"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {

                  if (
                    e.key === "Enter"
                  ) {

                    sendMessage()
                  }
                }}
                placeholder="Ask something..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#173b57] outline-none placeholder:text-[#9aa3b2]"
              />


              <button
                onClick={sendMessage}
                disabled={loading}
                className="text-sm font-medium text-[#c9572b] disabled:opacity-50"
              >
                ↑
              </button>

            </div>

          </div>

        </div>

      )}



      {/* ================================== */}
      {/* FLOATING BUTTON */}
      {/* ================================== */}

      <button
        onClick={() =>
          setOpen(
            (prev) => !prev
          )
        }
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c9572b] text-white shadow-lg transition hover:scale-105"
      >

        <span className="text-xl">
          ✦
        </span>

      </button>

    </div>
  )
}


export default AIAssistant