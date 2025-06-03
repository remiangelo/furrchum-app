import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import { WebView } from 'react-native-webview';
import { supabase } from '../../lib/supabase';

type ActiveCall = {
  id: string;
  room_url: string;
  vet_name: string;
  start_time: string;
};

export default function VideoCallScreen() {
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch active call from Supabase
  const fetchActiveCall = async () => {
    try {
      const { data, error } = await supabase
        .from('video_calls')
        .select('*')
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setActiveCall(data);
    } catch (error) {
      console.error('Error fetching active call:', error);
      alert('Error loading video call');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveCall();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!activeCall) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Video Call',
            headerShown: true,
          }}
        />
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            No Active Calls
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            You don&apos;t have any active video consultations at the moment.
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('/book-consultation')}
            style={styles.button}
          >
            Book Consultation
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Call with ${activeCall.vet_name}`,
          headerShown: true,
        }}
      />
      <WebView
        source={{ uri: activeCall.room_url }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  button: {
    borderRadius: 20,
  },
  webview: {
    flex: 1,
  },
});
