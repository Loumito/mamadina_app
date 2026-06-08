import React, {useState, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/authSlice';
import {useData} from '../../context/DataContext';
import {Screen, Avatar, EmptyState} from '../../components/ui';
import {COLORS} from '../../constants';
import {formatTime} from '../../utils/labels';
import {Conversation} from '../../types';

export const MessagesScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const {
    getConversationsForUser,
    getMessagesForConversation,
    getUserById,
    sendMessage,
    markConversationRead,
  } = useData();
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!user) return null;

  const conversations = getConversationsForUser(user.id);
  const active = conversations.find(c => c.id === activeId);

  if (active) {
    return (
      <ChatView
        conversation={active}
        currentUserId={user.id}
        onBack={() => setActiveId(null)}
      />
    );
  }

  const titleFor = (c: Conversation) => {
    if (c.name) return c.name;
    const other = c.participants.find(p => p !== user.id);
    const u = other ? getUserById(other) : undefined;
    return u ? `${u.firstName} ${u.lastName}` : 'Conversation';
  };

  return (
    <Screen title="Messages" subtitle={`${conversations.length} conversation(s)`}>
      {conversations.length === 0 ? (
        <EmptyState
          icon="💬"
          title="Aucune conversation"
          message="Vos échanges apparaîtront ici."
        />
      ) : (
        conversations.map(c => {
          const last = getMessagesForConversation(c.id).slice(-1)[0];
          return (
            <TouchableOpacity
              key={c.id}
              style={styles.convRow}
              activeOpacity={0.7}
              onPress={() => {
                markConversationRead(c.id);
                setActiveId(c.id);
              }}>
              <Avatar
                label={c.name ? c.name.charAt(0) : titleFor(c).charAt(0)}
                color={c.type === 'group' ? COLORS.secondary : COLORS.primary}
              />
              <View style={styles.convContent}>
                <View style={styles.convTop}>
                  <Text style={styles.convName} numberOfLines={1}>
                    {titleFor(c)}
                  </Text>
                  <Text style={styles.convTime}>
                    {formatTime(c.lastMessageAt)}
                  </Text>
                </View>
                <View style={styles.convBottom}>
                  <Text style={styles.convPreview} numberOfLines={1}>
                    {last?.content ?? c.lastMessage}
                  </Text>
                  {c.unreadCount ? (
                    <View style={styles.unread}>
                      <Text style={styles.unreadText}>{c.unreadCount}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </Screen>
  );
};

const ChatView: React.FC<{
  conversation: Conversation;
  currentUserId: string;
  onBack: () => void;
}> = ({conversation, currentUserId, onBack}) => {
  const {getMessagesForConversation, getUserById, sendMessage} = useData();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);
  const messages = getMessagesForConversation(conversation.id);

  const title =
    conversation.name ||
    (() => {
      const other = conversation.participants.find(p => p !== currentUserId);
      const u = other ? getUserById(other) : undefined;
      return u ? `${u.firstName} ${u.lastName}` : 'Conversation';
    })();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(conversation.id, currentUserId, trimmed);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({animated: true}), 50);
  };

  return (
    <View style={styles.chatScreen}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={onBack} hitSlop={10}>
          <Text style={styles.back}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.chatTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={{width: 60}} />
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.chatBody}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({animated: false})
          }
          renderItem={({item}) => {
            const mine = item.senderId === currentUserId;
            const sender = getUserById(item.senderId);
            return (
              <View
                style={[
                  styles.bubbleRow,
                  mine ? styles.bubbleRowMine : styles.bubbleRowOther,
                ]}>
                <View
                  style={[
                    styles.bubble,
                    mine ? styles.bubbleMine : styles.bubbleOther,
                  ]}>
                  {!mine && conversation.type === 'group' && sender ? (
                    <Text style={styles.senderName}>{sender.firstName}</Text>
                  ) : null}
                  <Text
                    style={[
                      styles.bubbleText,
                      mine && styles.bubbleTextMine,
                    ]}>
                    {item.content}
                  </Text>
                  <Text
                    style={[
                      styles.bubbleTime,
                      mine && styles.bubbleTimeMine,
                    ]}>
                    {formatTime(item.createdAt)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Écrire un message..."
            placeholderTextColor={COLORS.textDisabled}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            activeOpacity={0.8}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  convContent: {
    flex: 1,
    marginLeft: 12,
  },
  convTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  convName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  convTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  convBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  convPreview: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  unread: {
    backgroundColor: COLORS.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  chatScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  back: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    width: 60,
  },
  chatTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  chatBody: {
    padding: 16,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bubbleRowMine: {
    justifyContent: 'flex-end',
  },
  bubbleRowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bubbleMine: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  bubbleTextMine: {
    color: '#FFF',
  },
  bubbleTime: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleTimeMine: {
    color: 'rgba(255,255,255,0.8)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendIcon: {
    color: '#FFF',
    fontSize: 18,
  },
});
