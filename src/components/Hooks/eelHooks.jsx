import { eel } from "../../utils/eel";
import { useState, useEffect } from "react";
export function useServerPort() {
  const [serverPort, setServerPort] = useState("");

  useEffect(() => {
    eel
      .getServerPort()()
      .then((port) => setServerPort(port))
      .catch((e) => console.log(e, "Error with web server port"));
  }, []);

  return { serverPort };
}
