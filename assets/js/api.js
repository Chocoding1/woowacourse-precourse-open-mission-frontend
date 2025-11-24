import { axiosInstance } from "./axiosInstance.js";

function extractErrorBody(err) {
  return err.response?.data;
}

export async function loginApi({ email, password }) {
  try {
    const res = await axiosInstance.post("/login", { email, password });
    return res;
  } catch (err) {
    throw extractErrorBody(err);
  }
}

export async function sendEmailCodeApi({ email }) {
  try {
    const res = await axiosInstance.post("/emails/send-code", { email });
    return res.data;
  } catch (err) {
    throw extractErrorBody(err);
  }
}

export async function verifyEmailCodeApi({ email, authCode }) {
  try {
    const res = await axiosInstance.post("/emails/verify-code", {
      email,
      authCode,
    });
    return res.data;
  } catch (err) {
    throw extractErrorBody(err);
  }
}

export async function signupApi({ email, password, name }) {
  try {
    const res = await axiosInstance.post("/members", {
      email,
      password,
      name,
    });
    return res.data;
  } catch (err) {
    throw extractErrorBody(err);
  }
}

export async function getChatListApi() {
  try {
    const res = await axiosInstance.get("/chats/conversations");
    return res.data?.data?.conversationDtos || [];
  } catch (err) {
    throw extractErrorBody(err);
  }
}

export async function getChatHistoryApi(chatId) {
  try {
    const res = await axiosInstance.get(`/chats/conversations/${chatId}`);
    return res.data?.data?.messageDtos || [];
  } catch (err) {
    throw extractErrorBody(err);
  }
}

export async function sendMessageApi(chatId, prompt) {
  try {
    const res = chatId
      ? await axiosInstance.post(`/chats/${chatId}`, { prompt })
      : await axiosInstance.post("/chats", { prompt });

    return res.data;
  } catch (err) {
    throw extractErrorBody(err);
  }
}

export async function logoutApi(refreshToken) {
  try {
    const res = await axios.post("http://localhost:8080/logout", null, {
      headers: { "Authorization-Refresh": refreshToken },
    });
    return res.data;
  } catch (err) {
    throw extractErrorBody(err);
  }
}
