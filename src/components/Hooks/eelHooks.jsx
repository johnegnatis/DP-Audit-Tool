import { eel } from "../../utils/eel";
import { useState, useEffect } from "react";
import { handleError } from "../../utils/methods";
export function useServerPort() {
  const [serverPort, setServerPort] = useState("");

  useEffect(() => {
    eel
      .getServerPort()()
      .then((port) => setServerPort(port))
      .catch((e) => handleError(e));
  }, []);

  return { serverPort };
}
