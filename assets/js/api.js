import { axiosInstance } from "./axiosInstance.js";

export async function loginApi({ email, password }) {
  return axiosInstance.post("/login", { email, password });
}

export async function sendEmailCodeApi({ email }) {
  return axiosInstance.post("/emails/send-code", { email });
}

export async function verifyEmailCodeApi({ email, authCode }) {
  return axiosInstance.post("/emails/verify-code", { email, authCode });
}

export async function signupApi({ email, password, name }) {
  return axiosInstance.post("/members", { email, password, name });
}

export async function getChatListApi() {
  const res = await axiosInstance.get("/chats/conversations");
  return res.data?.data?.conversationDtos || [];
}

export async function getChatHistoryApi(chatId) {
  const res = await axiosInstance.get(`/chats/conversations/${chatId}`);
  return res.data?.data?.messageDtos || [];
}

export async function sendMessageApi(chatId, prompt) {
  if (chatId) {
    const res = await axiosInstance.post(`/chats/${chatId}`, { prompt });
    return res.data;
  } else {
    const res = await axiosInstance.post("/chats", { prompt });
    return res.data;
  }
}

export async function logoutApi(refreshToken) {
  return axios.post("/logout", null, {
    headers: { Authorization: refreshToken },
  });
}
