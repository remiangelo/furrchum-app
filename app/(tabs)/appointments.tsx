import { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, Card, Avatar } from 'react-native-paper';
import { Stack } from 'expo-router';
import { supabase } from '../../lib/supabase';

type Appointment = {
  id: string;
  vet_name: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: string;
};

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments from Supabase
  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Error loading appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'upcoming':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Appointments',
          headerShown: true,
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium">My Appointments</Text>
          <Button
            mode="contained"
            onPress={() => {/* TODO: Navigate to book appointment */}}
            style={styles.bookButton}
          >
            Book New
          </Button>
        </View>

        {appointments.map((appointment) => (
          <Card key={appointment.id} style={styles.card}>
            <Card.Title
              title={appointment.vet_name}
              subtitle={appointment.type}
              left={(props) => (
                <Avatar.Icon {...props} icon="doctor" />
              )}
            />
            <Card.Content>
              <View style={styles.appointmentDetails}>
                <Text variant="bodyMedium">
                  {new Date(appointment.date).toLocaleDateString()}
                </Text>
                <Text variant="bodyMedium">{appointment.time}</Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: getStatusColor(appointment.status) }}
                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {/* TODO: View appointment details */}}>
                View Details
              </Button>
              {appointment.status === 'upcoming' && (
                <Button onPress={() => {/* TODO: Cancel appointment */}}>
                  Cancel
                </Button>
              )}
            </Card.Actions>
          </Card>
        ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bookButton: {
    borderRadius: 20,
  },
  card: {
    marginBottom: 16,
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
