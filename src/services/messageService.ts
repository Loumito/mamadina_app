import {firebaseFirestore, COLLECTIONS} from '../api/firebase';
import {
  Message,
  Conversation,
  CreateConversationDto,
  SendMessageDto,
} from '../types';

export class MessageService {
  async createConversation(
    data: CreateConversationDto,
    createdBy: string,
  ): Promise<string> {
    try {
      const docRef = await firebaseFirestore
        .collection(COLLECTIONS.CONVERSATIONS)
        .add({
          ...data,
          createdBy,
          lastMessage: '',
          lastMessageAt: firebaseFirestore.FieldValue.serverTimestamp(),
          createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
        });

      return docRef.id;
    } catch (error: any) {
      console.error('Create conversation error:', error);
      throw new Error(error.message || 'Failed to create conversation');
    }
  }

  async sendMessage(data: SendMessageDto, senderId: string): Promise<string> {
    try {
      const docRef = await firebaseFirestore.collection(COLLECTIONS.MESSAGES).add({
        ...data,
        senderId,
        readBy: [senderId],
        createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });

      // Update conversation's last message
      await firebaseFirestore
        .collection(COLLECTIONS.CONVERSATIONS)
        .doc(data.conversationId)
        .update({
          lastMessage: data.content,
          lastMessageAt: firebaseFirestore.FieldValue.serverTimestamp(),
        });

      return docRef.id;
    } catch (error: any) {
      console.error('Send message error:', error);
      throw new Error(error.message || 'Failed to send message');
    }
  }

  async markAsRead(messageId: string, userId: string): Promise<void> {
    try {
      await firebaseFirestore
        .collection(COLLECTIONS.MESSAGES)
        .doc(messageId)
        .update({
          readBy: firebaseFirestore.FieldValue.arrayUnion(userId),
        });
    } catch (error: any) {
      console.error('Mark as read error:', error);
      throw new Error(error.message || 'Failed to mark message as read');
    }
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(COLLECTIONS.CONVERSATIONS)
        .where('participants', 'array-contains', userId)
        .orderBy('lastMessageAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Conversation[];
    } catch (error) {
      console.error('Get conversations error:', error);
      return [];
    }
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const snapshot = await firebaseFirestore
        .collection(COLLECTIONS.MESSAGES)
        .where('conversationId', '==', conversationId)
        .orderBy('createdAt', 'asc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
    } catch (error) {
      console.error('Get messages error:', error);
      return [];
    }
  }

  subscribeToConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void,
  ): () => void {
    const unsubscribe = firebaseFirestore
      .collection(COLLECTIONS.CONVERSATIONS)
      .where('participants', 'array-contains', userId)
      .orderBy('lastMessageAt', 'desc')
      .onSnapshot(
        snapshot => {
          const conversations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Conversation[];
          callback(conversations);
        },
        error => {
          console.error('Subscribe to conversations error:', error);
        },
      );

    return unsubscribe;
  }

  subscribeToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void,
  ): () => void {
    const unsubscribe = firebaseFirestore
      .collection(COLLECTIONS.MESSAGES)
      .where('conversationId', '==', conversationId)
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        snapshot => {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Message[];
          callback(messages);
        },
        error => {
          console.error('Subscribe to messages error:', error);
        },
      );

    return unsubscribe;
  }
}

export const messageService = new MessageService();
