export type MessageType = 'text' | 'image' | 'file';
export type ConversationType = 'private' | 'group';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  readBy: string[];
  createdAt: Date;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  participants: string[];
  name?: string;
  avatar?: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount?: number;
  createdAt: Date;
  createdBy: string;
}

export interface CreateConversationDto {
  type: ConversationType;
  participants: string[];
  name?: string;
}

export interface SendMessageDto {
  conversationId: string;
  type: MessageType;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}
