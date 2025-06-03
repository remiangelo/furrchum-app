import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      alert(error.message);
    } else {
      router.replace('/(tabs)');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Sign In',
          headerShown: true,
        }}
      />
      
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to FurrChum
        </Text>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        
        <Button
          mode="contained"
          onPress={handleSignIn}
          loading={loading}
          style={styles.button}
        >
          Sign In
        </Button>
        
        <Button
          mode="text"
          onPress={() => router.push('./sign-up')}
          style={styles.button}
        >
          Don't have an account? Sign Up
        </Button>
      </View>
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
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});
