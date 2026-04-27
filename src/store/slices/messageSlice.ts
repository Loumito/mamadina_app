import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Message, Conversation} from '../../types';

interface MessageState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: {[conversationId: string]: Message[]};
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: MessageState = {
  conversations: [],
  selectedConversation: null,
  messages: {},
  isLoading: false,
  error: null,
  unreadCount: 0,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.isLoading = false;
      state.error = null;
      // Calculate unread count
      state.unreadCount = action.payload.reduce(
        (sum, conv) => sum + (conv.unreadCount || 0),
        0,
      );
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload);
    },
    updateConversation: (state, action: PayloadAction<Conversation>) => {
      const index = state.conversations.findIndex(
        c => c.id === action.payload.id,
      );
      if (index !== -1) {
        state.conversations[index] = action.payload;
      }
    },
    setSelectedConversation: (
      state,
      action: PayloadAction<Conversation | null>,
    ) => {
      state.selectedConversation = action.payload;
    },
    setMessages: (
      state,
      action: PayloadAction<{conversationId: string; messages: Message[]}>,
    ) => {
      state.messages[action.payload.conversationId] = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const conversationId = action.payload.conversationId;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(action.payload);

      // Update conversation's last message
      const conversation = state.conversations.find(
        c => c.id === conversationId,
      );
      if (conversation) {
        conversation.lastMessage = action.payload.content;
        conversation.lastMessageAt = action.payload.createdAt;
      }
    },
    markMessageAsRead: (
      state,
      action: PayloadAction<{conversationId: string; messageId: string; userId: string}>,
    ) => {
      const {conversationId, messageId, userId} = action.payload;
      const messages = state.messages[conversationId];
      if (messages) {
        const message = messages.find(m => m.id === messageId);
        if (message && !message.readBy.includes(userId)) {
          message.readBy.push(userId);
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    incrementUnreadCount: state => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: state => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
  },
});

export const {
  setConversations,
  addConversation,
  updateConversation,
  setSelectedConversation,
  setMessages,
  addMessage,
  markMessageAsRead,
  setLoading,
  setError,
  incrementUnreadCount,
  decrementUnreadCount,
} = messageSlice.actions;

export default messageSlice.reducer;

// Selectors
export const selectConversations = (state: {messages: MessageState}) =>
  state.messages.conversations;
export const selectSelectedConversation = (state: {messages: MessageState}) =>
  state.messages.selectedConversation;
export const selectMessages = (conversationId: string) => (state: {messages: MessageState}) =>
  state.messages.messages[conversationId] || [];
export const selectMessagesLoading = (state: {messages: MessageState}) =>
  state.messages.isLoading;
export const selectMessagesError = (state: {messages: MessageState}) =>
  state.messages.error;
export const selectUnreadCount = (state: {messages: MessageState}) =>
  state.messages.unreadCount;
