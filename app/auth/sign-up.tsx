import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await signUp(email, password);
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the confirmation link!');
      router.replace('./sign-in');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Sign Up',
          headerShown: true,
        }}
      />
      
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Create Account
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
          onPress={handleSignUp}
          loading={loading}
          style={styles.button}
        >
          Sign Up
        </Button>
        
        <Button
          mode="text"
          onPress={() => router.replace('./sign-in')}
          style={styles.button}
        >
          Already have an account? Sign In
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
