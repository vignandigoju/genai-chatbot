import axios from "axios";

export const sendMessage = async (message: string) => {
const res = await axios.post("http://localhost:8000/chat", { message });
return res.data.response;
};
