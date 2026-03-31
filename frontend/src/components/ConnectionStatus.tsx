import type { ConnectionState } from "../types";

const STATUS_CONFIG: Record<ConnectionState, { color: string; label: string }> = {
  connecting: { color: "bg-yellow-400", label: "Connecting..." },
  connected: { color: "bg-green-500", label: "Connected" },
  disconnected: { color: "bg-red-500", label: "Reconnecting..." },
};

interface Props {
  state: ConnectionState;
}

export function ConnectionStatus({ state }: Props) {
  const { color, label } = STATUS_CONFIG[state];

  return (
    <div className="flex items-center gap-1.5 text-xs text-white/80">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}
