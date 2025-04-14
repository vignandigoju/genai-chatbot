import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
}

export const ChatInput = ({ onSend }: Props) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex gap-2 p-4 border-t bg-white">
      <input
        className="flex-1 p-2 border rounded-md"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};
