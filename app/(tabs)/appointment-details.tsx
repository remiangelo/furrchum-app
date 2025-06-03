import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Divider, List, ActivityIndicator } from 'react-native-paper';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { IconSymbol } from '@/components/ui/IconSymbol';

type Appointment = {
  id: string;
  pet_id: string;
  vet_name: string;
  date: string;
  time: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  pet?: {
    name: string;
    species: string;
    breed: string;
  };
};

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

  const fetchAppointmentDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pet:pets (
            name,
            species,
            breed
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setAppointment(data);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      alert('Error loading appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: confirmCancelAppointment },
      ]
    );
  };

  const confirmCancelAppointment = async () => {
    if (!appointment) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointment.id);

      if (error) throw error;
      
      alert('Appointment cancelled successfully');
      router.back();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Error cancelling appointment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Appointment not found</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

  const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = appointment.time.includes(':')
    ? appointment.time
    : `${appointment.time}:00`;

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
          title: 'Appointment Details',
          headerShown: true,
        }}
      />

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Title
            title={appointment.vet_name}
            subtitle={appointment.type}
            left={(props) => (
              <List.Icon {...props} icon="doctor" />
            )}
          />
          <Card.Content>
            <View style={styles.statusContainer}>
              <Text variant="titleMedium">Status:</Text>
              <Text
                variant="titleMedium"
                style={{ color: getStatusColor(appointment.status) }}
              >
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <List.Item
              title="Date"
              description={formattedDate}
              left={props => <List.Icon {...props} icon="calendar" />}
            />
            <List.Item
              title="Time"
              description={formattedTime}
              left={props => <List.Icon {...props} icon="clock" />}
            />
            
            {appointment.pet && (
              <List.Item
                title="Pet"
                description={`${appointment.pet.name} (${appointment.pet.breed})`}
                left={props => <List.Icon {...props} icon="paw" />}
              />
            )}

            {appointment.notes && (
              <>
                <Divider style={styles.divider} />
                <Text variant="titleMedium" style={styles.notesTitle}>Notes:</Text>
                <Text variant="bodyMedium" style={styles.notes}>
                  {appointment.notes}
                </Text>
              </>
            )}
          </Card.Content>
        </Card>

        {appointment.status === 'upcoming' && (
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => router.push({
                pathname: '/book-appointment',
                params: { id: appointment.id }
              })}
              style={[styles.button, styles.rescheduleButton]}
            >
              Reschedule
            </Button>
            <Button
              mode="outlined"
              onPress={handleCancelAppointment}
              style={[styles.button, styles.cancelButton]}
              textColor="#F44336"
            >
              Cancel
            </Button>
          </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  notesTitle: {
    marginBottom: 8,
  },
  notes: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  rescheduleButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    borderColor: '#F44336',
  },
});