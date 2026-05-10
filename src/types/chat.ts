export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  status?: "sending" | "sent" | "error";
  metadata?: {
    isStreaming?: boolean;
    educationalContext?: EducationalContext;
  };
}

export interface EducationalContext {
  type: "concept" | "code" | "practice" | "quiz" | "warning" | "tip";
  title?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
  category?: string;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  sidebarOpen: boolean;
}
