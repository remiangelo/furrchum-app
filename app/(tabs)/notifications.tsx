import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Chip, IconButton, Divider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { supabase } from '../../lib/supabase';

type Notification = {
  id: string;
  type: 'appointment' | 'medication' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for notifications
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'appointment',
      title: 'Upcoming Appointment',
      message: 'You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM.',
      date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      read: false,
    },
    {
      id: '2',
      type: 'medication',
      title: 'Medication Reminder',
      message: 'Time to give Max his heartworm medication.',
      date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      read: true,
    },
    {
      id: '3',
      type: 'system',
      title: 'Welcome to FurrChum',
      message: 'Thank you for joining FurrChum! We\'re excited to help you care for your pet.',
      date: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
      read: true,
    },
    {
      id: '4',
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: 'Your appointment with Dr. Michael Chen on Friday at 2:00 PM has been confirmed.',
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      read: false,
    },
    {
      id: '5',
      type: 'medication',
      title: 'Vaccination Due',
      message: 'Max\'s rabies vaccination is due in 2 weeks. Please schedule an appointment.',
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      read: false,
    },
  ];

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .select('*')
      //   .order('date', { ascending: false });
      
      // if (error) throw error;
      // setNotifications(data || []);

      // Using mock data for now
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      alert('Error loading notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    // In a real app, this would update the database
    // supabase.from('notifications').update({ read: true }).eq('id', id);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    // In a real app, this would update the database
    // supabase.from('notifications').update({ read: true }).in('id', notifications.map(n => n.id));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    // In a real app, this would delete from the database
    // supabase.from('notifications').delete().eq('id', id);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return 'calendar';
      case 'medication':
        return 'pill';
      case 'system':
        return 'information';
      default:
        return 'bell';
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Notifications',
          headerShown: true,
        }}
      />

      <View style={styles.header}>
        <Text variant="headlineMedium">Notifications</Text>
        {unreadCount > 0 && (
          <Button
            mode="text"
            onPress={markAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge">No notifications yet</Text>
            <Text variant="bodyMedium" style={styles.emptyStateSubtext}>
              When you receive notifications, they will appear here.
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard
              ]}
            >
              <Card.Content>
                <View style={styles.notificationHeader}>
                  <View style={styles.titleContainer}>
                    <Chip 
                      icon={getNotificationIcon(notification.type)}
                      style={styles.typeChip}
                    >
                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                    </Chip>
                    {!notification.read && (
                      <View style={styles.unreadDot} />
                    )}
                  </View>
                  <Text variant="bodySmall" style={styles.date}>
                    {getRelativeTime(notification.date)}
                  </Text>
                </View>
                <Text variant="titleMedium" style={styles.title}>
                  {notification.title}
                </Text>
                <Text variant="bodyMedium" style={styles.message}>
                  {notification.message}
                </Text>
              </Card.Content>
              <Card.Actions>
                {!notification.read && (
                  <Button onPress={() => markAsRead(notification.id)}>
                    Mark as Read
                  </Button>
                )}
                <IconButton
                  icon="delete"
                  onPress={() => deleteNotification(notification.id)}
                />
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  notificationCard: {
    marginBottom: 16,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeChip: {
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  title: {
    marginBottom: 4,
  },
  message: {
    marginBottom: 8,
  },
  date: {
    color: '#757575',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateSubtext: {
    textAlign: 'center',
    color: '#757575',
    marginTop: 8,
  },
});