import { useState } from "react";
import { ChatInput } from "../components/ChatInput";
import { MessageList } from "../components/MessageList";
import { sendMessage } from "../api/chat";

export const ChatPage = () => {
  const [messages, setMessages] = useState<
    { message: string; isUser: boolean }[]
  >([]);

  const handleSend = async (userMsg: string) => {
    setMessages((prev) => [...prev, { message: userMsg, isUser: true }]);
    try {
      const res = await sendMessage(userMsg);
      setMessages((prev) => [...prev, { message: res, isUser: false }]);
    } catch (err) {
      setMessages((prev) => [...prev, { message: "Error!", isUser: false }]);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="text-center text-xl font-bold p-4 bg-gray-100">
        💬 GenAI Chatbot
      </header>
      <div className="flex-1 overflow-auto bg-gray-50">
        <MessageList messages={messages} />
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
};
