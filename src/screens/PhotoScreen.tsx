import React, {useEffect, useState} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {PrimaryButton} from '../components/PrimaryButton';
import {SurfaceCard} from '../components/SurfaceCard';
import {colors, radius, spacing} from '../theme/colors';
import {savePhoto, subscribeToPhoto} from '../services/firestore';
import {firebaseAuth} from '../lib/firebase';

const MAX_DIMENSION = 900;
const JPEG_QUALITY = 0.6;
const APPROX_FIRESTORE_LIMIT = 900 * 1024; // ~900 KB to stay under the 1 MB doc cap

const pickerOptions = {
  mediaType: 'photo' as const,
  includeBase64: true,
  quality: JPEG_QUALITY,
  maxWidth: MAX_DIMENSION,
  maxHeight: MAX_DIMENSION,
};

const estimateBytes = (base64: string) => Math.ceil((base64.length * 3) / 4);

function PhotoScreen() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');
  const user = firebaseAuth.currentUser;

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = subscribeToPhoto(user.uid, setImageBase64);
    return unsubscribe;
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <SurfaceCard>
          <Text style={styles.title}>Sign in required</Text>
          <Text style={styles.subtitle}>
            Please authenticate to upload a photo.
          </Text>
        </SurfaceCard>
      </View>
    );
  }

  const handleSelection = async (source: 'camera' | 'library') => {
    setStatus('');
    const picker = source === 'camera' ? launchCamera : launchImageLibrary;
    const result = await picker(pickerOptions);

    if (result.didCancel) {
      return;
    }
    const asset = result.assets?.[0];
    if (!asset?.base64) {
      Alert.alert(
        'Oops',
        'We could not read the image data. Try another photo.',
      );
      return;
    }

    const approxBytes = estimateBytes(asset.base64);
    if (approxBytes > APPROX_FIRESTORE_LIMIT) {
      Alert.alert(
        'Image too large',
        'Please pick a smaller photo so we can store it inside Firestore.',
      );
      return;
    }

    try {
      setUploading(true);
      await savePhoto(user.uid, asset.base64);
      setStatus('Photo saved to Firestore.');
    } catch (error) {
      console.error(error);
      Alert.alert('Upload failed', 'We could not upload that photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <SurfaceCard>
        <Text style={styles.title}>Photo vault</Text>
        <Text style={styles.subtitle}>
          Capture or pick a picture, then store it securely inside Firestore. We
          listen via onSnapshot so the preview updates instantly on every
          device.
        </Text>

        <View style={styles.previewWrapper}>
          {imageBase64 ? (
            <Image
              source={{uri: `data:image/jpeg;base64,${imageBase64}`}}
              style={styles.preview}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No photo yet</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonColumn}>
          <PrimaryButton
            label={uploading ? 'Saving...' : 'Use camera'}
            onPress={() => handleSelection('camera')}
            disabled={uploading}
            style={styles.buttonSpacing}
          />
          <PrimaryButton
            label={uploading ? 'Saving...' : 'Pick from gallery'}
            onPress={() => handleSelection('library')}
            disabled={uploading}
            variant="secondary"
            style={styles.buttonSpacing}
          />
        </View>

        {status.length > 0 && <Text style={styles.feedback}>{status}</Text>}
      </SurfaceCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  scroll: {
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
    marginBottom: spacing.lg,
  },
  previewWrapper: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.lg,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  placeholderText: {
    color: colors.mutedText,
  },
  buttonColumn: {
    width: '100%',
  },
  buttonSpacing: {
    marginBottom: spacing.sm,
  },
  feedback: {
    color: colors.accent,
    marginTop: spacing.md,
  },
});

export default PhotoScreen;
