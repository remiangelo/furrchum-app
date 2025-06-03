import { useState } from 'react';
import { StyleSheet, View, ScrollView, Switch, Alert } from 'react-native';
import { Text, List, Button, Divider, Avatar } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          onPress: async () => {
            setLoading(true);
            try {
              const { error } = await signOut();
              if (error) throw error;
            } catch (error) {
              console.error('Error signing out:', error);
              alert('Error signing out');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive'
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            // In a real app, this would delete the user's account
            alert('This feature would delete your account in a real app.');
          },
          style: 'destructive'
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerShown: true,
        }}
      />

      <ScrollView style={styles.content}>
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Profile"
            description="Edit your personal information"
            left={props => <List.Icon {...props} icon="account" />}
            onPress={() => alert('This would navigate to profile settings')}
          />
          <List.Item
            title="Password"
            description="Change your password"
            left={props => <List.Icon {...props} icon="lock" />}
            onPress={() => alert('This would navigate to password settings')}
          />
          <List.Item
            title="Payment Methods"
            description="Manage your payment options"
            left={props => <List.Icon {...props} icon="credit-card" />}
            onPress={() => alert('This would navigate to payment methods')}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          <List.Item
            title="Push Notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
              />
            )}
          />
          <List.Item
            title="Email Notifications"
            left={props => <List.Icon {...props} icon="email" />}
            right={() => (
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Support</List.Subheader>
          <List.Item
            title="Help Center"
            left={props => <List.Icon {...props} icon="help-circle" />}
            onPress={() => alert('This would navigate to help center')}
          />
          <List.Item
            title="Contact Us"
            left={props => <List.Icon {...props} icon="message" />}
            onPress={() => alert('This would navigate to contact form')}
          />
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield" />}
            onPress={() => alert('This would navigate to privacy policy')}
          />
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => alert('This would navigate to terms of service')}
          />
        </List.Section>

        <Divider />

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={handleSignOut}
            loading={loading}
            style={styles.signOutButton}
          >
            Sign Out
          </Button>
          <Button
            mode="text"
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
            textColor="#F44336"
          >
            Delete Account
          </Button>
        </View>
      </ScrollView>
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
    padding: 16,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  signOutButton: {
    marginBottom: 16,
  },
  deleteButton: {
    marginBottom: 16,
  },
});