import { message } from "antd";

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

const errorTypeMap = {
  Error: sendError,
  Warning: sendWarning,
};
export const handleError = (error, key) => {
  console.error(error);
  try {
    const msg = error.errorText.replace("Exception('", "").replace("')", "").split(":");
    const sendErrorFunction = errorTypeMap[msg[0]];
    const errMessage = msg[1];
    sendErrorFunction(errMessage.trim(), key);
  } catch {
    sendError("Something went wrong", key);
  }
};
