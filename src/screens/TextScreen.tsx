import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, View} from 'react-native';

import {PrimaryButton} from '../components/PrimaryButton';
import {SurfaceCard} from '../components/SurfaceCard';
import {colors, radius, spacing} from '../theme/colors';
import {saveUserText, subscribeToTexts, UserText} from '../services/firestore';
import {firebaseAuth} from '../lib/firebase';

function TextScreen() {
  const user = firebaseAuth.currentUser;
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState<UserText[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = subscribeToTexts(user.uid, setMessages);
    return unsubscribe;
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <SurfaceCard>
          <Text style={styles.title}>Sign in required</Text>
          <Text style={styles.subtitle}>
            Please authenticate to save and read text entries.
          </Text>
        </SurfaceCard>
      </View>
    );
  }

  const handleSave = async () => {
    const text = draft.trim();
    if (text.length === 0) {
      return;
    }

    try {
      setSaving(true);
      await saveUserText(user.uid, text);
      setDraft('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <SurfaceCard>
        <Text style={styles.title}>Realtime scratchpad</Text>
        <Text style={styles.subtitle}>
          Write anything and we will drop it inside Firestore, then stream every
          change using onSnapshot.
        </Text>

        <TextInput
          style={styles.textArea}
          placeholder="Write something brilliant..."
          placeholderTextColor={colors.mutedText}
          multiline
          value={draft}
          onChangeText={setDraft}
        />
        <PrimaryButton
          label="Send"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
        />
      </SurfaceCard>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{item.text}</Text>
            {item.createdAt && (
              <Text style={styles.timestamp}>
                {item.createdAt.toLocaleString()}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No messages yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.mutedText,
    marginBottom: spacing.md,
  },
  textArea: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    minHeight: 110,
    padding: spacing.md,
    color: colors.text,
    backgroundColor: colors.surfaceAlt,
    marginBottom: spacing.md,
  },
  list: {
    paddingVertical: spacing.lg,
  },
  messageBubble: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.md,
  },
  messageText: {
    color: colors.text,
  },
  timestamp: {
    color: colors.mutedText,
    marginTop: spacing.xs,
    fontSize: 12,
  },
  empty: {
    color: colors.mutedText,
    textAlign: 'center',
    paddingTop: spacing.md,
  },
});

export default TextScreen;
