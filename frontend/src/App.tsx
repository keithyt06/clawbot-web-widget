import { useMemo } from "react";
import { ChatWidget } from "./components/ChatWidget";

export default function App() {
  const userId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("userId") ?? `anon-${crypto.randomUUID().slice(0, 8)}`;
  }, []);

  return <ChatWidget userId={userId} />;
}
