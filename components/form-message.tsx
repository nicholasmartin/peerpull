export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {"success" in message && (
        <div className="bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 px-4 py-3 rounded">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="bg-red-500/10 text-red-400 border-l-4 border-red-500 px-4 py-3 rounded">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="bg-blue-500/10 text-blue-400 border-l-4 border-blue-500 px-4 py-3 rounded">{message.message}</div>
      )}
    </div>
  );
}
