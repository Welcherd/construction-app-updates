import { useState } from "react";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, MessageCircle, MoreHorizontal } from "lucide-react";
import { getFlag } from "@/components/WorldMap";
import { cn } from "@/lib/utils";

const CONVERSATIONS = [
  {
    id: "1",
    name: "Mike Rodriguez",
    initials: "MR",
    lastMessage: "That excavator worked perfectly for the residential project!",
    time: "2m",
    unread: 2,
    country: "US",
    online: true,
  },
  {
    id: "2",
    name: "Aisha Okonkwo",
    initials: "AO",
    lastMessage: "We can discuss the marine piling partnership next week",
    time: "1h",
    unread: 0,
    country: "NG",
    online: true,
  },
  {
    id: "3",
    name: "Kenji Tanaka",
    initials: "KT",
    lastMessage: "The seismic methodology document is ready for review",
    time: "3h",
    unread: 1,
    country: "JP",
    online: false,
  },
  {
    id: "4",
    name: "Hans Muller",
    initials: "HM",
    lastMessage: "Prefab panels shipped from Hamburg factory",
    time: "5h",
    unread: 0,
    country: "DE",
    online: false,
  },
  {
    id: "5",
    name: "Sarah Chen",
    initials: "SC",
    lastMessage: "Thanks for the crane operator recommendation!",
    time: "1d",
    unread: 0,
    country: "US",
    online: true,
  },
];

export function MessagesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);

  const filtered = CONVERSATIONS.filter(
    (c) =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedConversation) {
    return (
      <ChatView
        conversation={selectedConversation}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 glass-panel border-b border-border/50 px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50"
            data-testid="messages-search"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border/50">
        {filtered.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onClick={() => setSelectedConversation(conversation)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-3 rounded-full bg-muted p-4">
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No conversations found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start connecting with workers worldwide
          </p>
        </div>
      )}
    </div>
  );
}

function ConversationItem({ conversation, onClick }) {
  const flag = getFlag(conversation.country);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full glass-panel p-4 text-left transition-colors hover:bg-muted/50 select-none"
      data-testid={`conversation-${conversation.id}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
            {conversation.initials}
          </div>
          {conversation.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-foreground">{conversation.name}</h3>
              <span className="text-sm leading-none" aria-hidden="true">{flag}</span>
            </div>
            <span className="text-xs text-muted-foreground">{conversation.time}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-muted-foreground truncate pr-2">
              {conversation.lastMessage}
            </p>
            {conversation.unread > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                {conversation.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function ChatView({ conversation, onBack }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "them",
      text: conversation.lastMessage,
      time: conversation.time,
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "me",
        text: message,
        time: "now",
      },
    ]);
    setMessage("");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 glass-panel border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
            data-testid="back-to-messages"
          >
            ←
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
            {conversation.initials}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">{conversation.name}</h3>
            <p className="text-xs text-muted-foreground">
              {conversation.online ? "Online" : "Offline"}
            </p>
          </div>
          <button type="button" className="text-muted-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.sender === "me" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2",
                msg.sender === "me"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "glass-panel text-foreground rounded-bl-sm"
              )}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={cn(
                "text-xs mt-1",
                msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 glass-panel border-t border-border/50 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-background/50"
            data-testid="message-input"
          />
          <Button size="icon" onClick={handleSend} data-testid="send-message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
