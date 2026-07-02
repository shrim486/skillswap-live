import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import HeroBackground from "../components/HeroBackground";

function AIMentor() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;
    }
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setChat((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/ai/chat", {
        message: userMessage,
      });

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: res.data.reply,
        },
      ]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div
      className="
      fixed
      inset-0
      z-50
      h-screen
      w-screen
      overflow-hidden
      bg-slate-950
      "
    >
      <HeroBackground />

      <div
        className="
        relative
        z-10
        h-screen
        max-w-5xl
        mx-auto
        px-6
        pt-20
        pb-6
        flex
        flex-col
        overflow-hidden
        "
      >
        <h1
          className="
          text-4xl
          text-white
          font-bold
          mb-6
          flex-shrink-0
          "
        >
          ✨ Lumi AI Mentor
        </h1>

        <div
          className="
          flex-1
          min-h-0
          flex
          flex-col
          bg-slate-900/70
          backdrop-blur-xl
          border
          border-slate-800
          rounded-3xl
          p-8
          overflow-hidden
          "
        >
          <div
            ref={chatRef}
            className="
            flex-1
            min-h-0
            overflow-y-auto
            space-y-5
            pr-2
            "
          >
            {chat.length === 0 && (
              <div className="text-slate-500">
                Start a conversation with Lumi ✨
              </div>
            )}

            {chat.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[70%] bg-indigo-600 text-white p-4 rounded-3xl"
                      : "max-w-[70%] bg-slate-800 text-white p-4 rounded-3xl"
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-slate-400">
                Lumi is thinking...
              </div>
            )}
          </div>

          <div
            className="
            flex
            gap-4
            mt-6
            flex-shrink-0
            "
          >
            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask Lumi anything..."
              className="
              flex-1
              bg-slate-800
              p-4
              rounded-2xl
              text-white
              outline-none
              "
            />

            <button
              onClick={sendMessage}
              className="
              bg-indigo-600
              hover:bg-indigo-500
              px-8
              rounded-2xl
              text-white
              "
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIMentor;