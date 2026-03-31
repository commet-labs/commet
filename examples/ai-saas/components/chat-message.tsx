import type { UIMessage } from "ai";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <Avatar className="mt-0.5 size-7">
        <AvatarFallback
          className={cn(
            "text-[10px]",
            !isUser && "bg-primary text-primary-foreground",
          )}
        >
          {isUser ? "U" : "AI"}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {message.parts
          .filter((part) => part.type === "text")
          .map((part) => (
            <p key={part.text.slice(0, 20)} className="whitespace-pre-wrap">
              {part.text}
            </p>
          ))}
      </div>
    </div>
  );
}
