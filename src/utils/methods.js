import { message } from "antd";
export const extractErrorMessage = (errorText) => {
  return errorText.replace("Exception('", "").replace("')", "");
};

export const sendSuccess = (content, key = null) => {
  message.open({ type: "success", content, key });
};

export const sendError = (content, key = null) => {
  message.open({ type: "error", content, key });
};

export const sendWarning = (content, key = null) => {
  message.open({ type: "warning", content, key });
};

export const sendLoading = (content, key = null) => {
  message.open({ type: "loading", content, duration: 0, key });
};

export const sendWaiting = (content, key, cleanup) => {
  message.open({
    key,
    type: "info",
    content,
    duration: 0,
  });
};