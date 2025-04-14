import { ChatMessage } from "./ChatMessage";

interface Props {
  messages: { message: string; isUser: boolean }[];
}

export const MessageList = ({ messages }: Props) => {
  return (
    <div className="flex flex-col space-y-2 overflow-y-auto p-4">
      {messages.map((msg, i) => (
        <ChatMessage key={i} message={msg.message} isUser={msg.isUser} />
      ))}
    </div>
  );
};
