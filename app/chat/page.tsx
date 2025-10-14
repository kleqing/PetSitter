"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from 'next/navigation';
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ConversationList } from "@/components/chat/conversation-list"
import { ChatWindow } from "@/components/chat/chat-window"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Heart, Loader2 } from "lucide-react"
import type { Conversation, Message, Participant } from "@/types/chat"
import { toast } from "sonner";
import { UserRole } from "@/enum/UserRole";
import { set } from "date-fns";

const transformApiDataToConversation = (apiData: any[], currentUserId: string | undefined): Conversation[] => {
  if (!Array.isArray(apiData) || !currentUserId) return [];
  const mappedConversations = apiData.map(conv => {
    if (!conv || !conv.petOwner || !conv.shop || !conv.shop.user) {
      return null; 
    }
    // XỬ LÝ lastMessageAt MỘT CÁCH AN TOÀN
    let lastMessageTimestamp = conv.createdAt; // Mặc định lấy thời gian tạo conversation
    if (conv.lastMessage && conv.lastMessage.sentAt) {
      lastMessageTimestamp = conv.lastMessage.sentAt;
    }
    const participants: Participant[] = [
      {
        userId: conv.petOwner.userId,
        fullName: conv.petOwner.fullName,
        role: conv.petOwner.role as UserRole,
        profilePictureUrl: conv.petOwner.profilePictureUrl,
        isOnline: false,
      },
      {
        userId: conv.shop.user.userId,
        fullName: conv.shop.shopName,
        role: conv.shop.user.role as UserRole,
        profilePictureUrl: conv.shop.shopImageUrl,
        isOnline: false,
      },
    ];

    const lastMessageAt = conv.lastMessage?.sentAt || conv.createdAt;
    const conversationObject: Conversation = {
      conversationId: conv.conversationId,
      participants: participants,
      lastMessage: conv.lastMessage || undefined, 
      lastMessageAt: lastMessageAt,
      unreadCount: 0, 
      serviceInfo: undefined,
    };
    return conversationObject;
  });
   return mappedConversations.filter(Boolean) as Conversation[];
};

export default function ChatPage() {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0); // State mới để "ra lệnh" fetch lại

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Cập nhật URL mà không reload trang
    router.push(`/chat?conversationId=${conversation.conversationId}`, { scroll: false });
  };

  useEffect(() => {
  if (!token || !user) return; // chỉ chạy khi có đủ dữ liệu

  const initializePage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://petsitter.runasp.net/api/chat/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch conversations");

      const fetchedConversations = transformApiDataToConversation(await response.json() || [], user.userId);
      setConversations(fetchedConversations);

      const conversationIdFromUrl = searchParams.get('conversationId');
      const newShopId = searchParams.get('new');

      let conversationToSelect;

      if (conversationIdFromUrl) {
        conversationToSelect = fetchedConversations.find(c => c.conversationId === conversationIdFromUrl);
      } else if (newShopId) {
        const existing = fetchedConversations.find(c =>
          c.participants.some(p => p.userId === newShopId && p.role === UserRole.Shop)
        );

        if (existing) {
          conversationToSelect = existing;
        } else {
          const createRes = await fetch(`https://petsitter.runasp.net/api/chat/conversations`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ shopId: newShopId }),
          });
          if (!createRes.ok) throw new Error("Failed to create conversation");

          const newConvRaw = await createRes.json();
          router.replace(`/chat?conversationId=${newConvRaw.conversationId}`, { scroll: false });
          return;
        }
      }

      if (conversationToSelect) {
        setSelectedConversation(conversationToSelect);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  initializePage();
  // chỉ chạy khi token/user thay đổi thực sự, không theo router hay searchParams
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [token, user]);

  
  if (!user && !isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Please log in</h2>
              <p className="text-muted-foreground">You need to be logged in to access your messages</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    )
  }
const conversationIdFromUrl = searchParams.get('conversationId');

  return (
    // 1. Container chính: Đặt chiều cao CỐ ĐỊNH bằng màn hình và ẩn mọi thứ tràn ra ngoài
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Navigation />

      {/* 2. Nội dung chính: Tự co giãn và cũng ẩn phần tràn */}
      <main className="flex-1 flex flex-col pt-8 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
            <p className="text-muted-foreground">Connect with pet care providers and discuss your pet's needs</p>
          </div>

          {/* 3. Grid chat: Tự co giãn và thêm 'min-h-0' để hoạt động đúng trong flexbox */}
          <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0 pb-8">
            {/* Cột danh sách conversation */}
            <div className="lg:col-span-1 flex flex-col">
              <ConversationList
                conversations={conversations}
                isLoading={isLoading}
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversation?.conversationId}
              />
            </div>

            {/* Cột cửa sổ chat */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedConversation ? (
                <ChatWindow 
                  conversation={selectedConversation} 
                  onBack={() => {
                    setSelectedConversation(null);
                    router.push('/chat', { scroll: false });
                  }} 
                />
              ) : (conversationIdFromUrl && isLoading) ? ( // Nếu có ID trên URL và đang load
                <Card className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </Card>
                ) : ( // Trường hợp mặc định
                <Card className="h-[600px] flex items-center justify-center">
                  <CardContent className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the list to start chatting about pet care services
                    </p>
                  </CardContent>
                </Card>
             )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer sẽ bị đẩy ra ngoài nếu không đủ chỗ, chúng ta sẽ ẩn nó trên trang chat */}
    </div>
  )
}
