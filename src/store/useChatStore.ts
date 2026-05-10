import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Conversation, Message, UserSettings } from "../types/chat";

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  settings: UserSettings;
  isGenerating: boolean;

  // Actions
  addMessage: (conversationId: string, message: Omit<Message, "id" | "timestamp">) => void;
  updateLastMessage: (conversationId: string, content: string, isStreaming: boolean) => void;
  createConversation: (title?: string) => string;
  setCurrentConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  clearHistory: () => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

const BRAND_NAME = "Nexus AI";
const INITIAL_ID = Math.random().toString(36).substring(7);

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: INITIAL_ID,
    title: "Understanding Quantum Computing",
    updatedAt: Date.now(),
    category: "Physics & AI",
    messages: [
      {
        id: "m1",
        role: "assistant",
        content: `Welcome to **${BRAND_NAME}**. I am your advanced neural learning interface.

I can assist you with:
- **Architectural Design** (Cloud, System, Database)
- **Deep Code Analysis** (Debugging, Optimization, Security)
- **Mathematical Modeling** (AI/ML, Data Science)
- **Strategic Career Growth** (Interviews, Roadmaps)

How shall we begin our session today?`,
        timestamp: Date.now(),
      },
    ],
  },
];

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversations: MOCK_CONVERSATIONS,
      currentConversationId: INITIAL_ID,
      settings: {
        theme: "dark",
        fontSize: "medium",
        sidebarOpen: true,
      },
      isGenerating: false,

      setIsGenerating: (isGenerating) => set({ isGenerating }),

      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
        };

        set((state) => {
          const updatedConversations = state.conversations.map((conv) => {
            if (conv.id === conversationId) {
              let newTitle = conv.title;
              if (conv.messages.length <= 1 && message.role === "user") {
                newTitle = message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "");
              }

              return {
                ...conv,
                title: newTitle,
                messages: [...conv.messages, newMessage],
                updatedAt: Date.now(),
              };
            }
            return conv;
          });

          return { conversations: updatedConversations };
        });
      },

      updateLastMessage: (conversationId, content, isStreaming) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg, index) =>
                    index === conv.messages.length - 1
                      ? { ...msg, content, metadata: { ...msg.metadata, isStreaming } }
                      : msg
                  ),
                }
              : conv
          ),
        }));
      },

      createConversation: (title = "New Learning Session") => {
        const id = Math.random().toString(36).substring(7);
        const newConv: Conversation = {
          id,
          title,
          updatedAt: Date.now(),
          messages: [
            {
              id: Math.random().toString(36).substring(7),
              role: "assistant",
              content: `A new session has been initialized. I am ready to assist with your inquiries. What topic are we exploring?`,
              timestamp: Date.now(),
            }
          ],
          category: "General",
        };

        set((state) => ({
          conversations: [newConv, ...state.conversations],
          currentConversationId: id,
        }));

        return id;
      },

      setCurrentConversation: (id) => set({ currentConversationId: id }),

      deleteConversation: (id) =>
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== id);
          return {
            conversations: newConversations,
            currentConversationId:
              state.currentConversationId === id
                ? newConversations[0]?.id || null
                : state.currentConversationId,
          };
        }),

      renameConversation: (id, title) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        })),

      clearHistory: () => set({ conversations: [], currentConversationId: null }),

      toggleTheme: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            theme: state.settings.theme === "dark" ? "light" : "dark",
          },
        })),

      setSidebarOpen: (open) =>
        set((state) => ({
          settings: { ...state.settings, sidebarOpen: open },
        })),
    }),
    {
      name: "nexus-chat-storage",
    }
  )
);
