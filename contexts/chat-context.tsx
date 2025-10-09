// contexts/chat-context.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./auth-context";
import type { Message } from "@/types/chat";

interface ChatContextType {
  connection: signalR.HubConnection | null;
  // Bỏ messages và setMessages khỏi context để từng component tự quản lý
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  joinConversation: (conversationId: string) => Promise<void>; // <-- THÊM MỚI
  leaveConversation: (conversationId: string) => Promise<void>; // <-- THÊM MỚI
  userStartedTyping: (conversationId: string) => Promise<void>;
  userStoppedTyping: (conversationId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) { // Chỉ tạo connection nếu chưa có
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7277/chathub", {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
    // Start the connection
      newConnection.start()
        .then()
        .catch();
        
      // Cleanup on component unmount
      return () => {
        newConnection.stop();
      };
    }
  }, [token]);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    if (connection) {
      try {
        await connection.invoke("SendMessage", conversationId, content);
      } catch (err) {
      }
    }
  }, [connection]);

  // THÊM CÁC HÀM MỚI
  const joinConversation = useCallback(async (conversationId: string) => {
    if (connection) {
      try {
        await connection.invoke("JoinConversation", conversationId);
      } catch (err) {
      }
    }
  }, [connection]);

  const leaveConversation = useCallback(async (conversationId: string) => {
    if (connection) {
      try {
        await connection.invoke("LeaveConversation", conversationId); // Giả sử bạn có hàm này ở Hub
      } catch (err) {
      }
    }
  }, [connection]);

  const userStartedTyping = useCallback(async (conversationId: string) => {
        if (connection) await connection.invoke("UserStartedTyping", conversationId);
    }, [connection]);

    const userStoppedTyping = useCallback(async (conversationId: string) => {
        if (connection) await connection.invoke("UserStoppedTyping", conversationId);
    }, [connection]);
  
  return (
    <ChatContext.Provider value={{ connection, sendMessage, joinConversation, leaveConversation, userStartedTyping, userStoppedTyping }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};