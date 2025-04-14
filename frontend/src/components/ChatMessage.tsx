import { motion } from "framer-motion";

interface Props {
  message: string;
  isUser: boolean;
}

export const ChatMessage = ({ message, isUser }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 my-2 rounded-xl max-w-[75%] ${
        isUser ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
      }`}
    >
      {message}
    </motion.div>
  );
};
