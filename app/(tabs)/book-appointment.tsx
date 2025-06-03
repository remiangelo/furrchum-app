import { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, Chip, RadioButton, Divider } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function BookAppointmentScreen() {
  const [appointmentType, setAppointmentType] = useState('check-up');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample data for available dates and times
  const availableDates = [
    { date: '2023-11-15', label: 'Wed, Nov 15' },
    { date: '2023-11-16', label: 'Thu, Nov 16' },
    { date: '2023-11-17', label: 'Fri, Nov 17' },
    { date: '2023-11-20', label: 'Mon, Nov 20' },
    { date: '2023-11-21', label: 'Tue, Nov 21' },
  ];

  const availableTimes = [
    { time: '09:00', label: '9:00 AM' },
    { time: '10:00', label: '10:00 AM' },
    { time: '11:00', label: '11:00 AM' },
    { time: '13:00', label: '1:00 PM' },
    { time: '14:00', label: '2:00 PM' },
    { time: '15:00', label: '3:00 PM' },
  ];

  const appointmentTypes = [
    { value: 'check-up', label: 'Regular Check-up' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'illness', label: 'Illness/Injury' },
    { value: 'dental', label: 'Dental Care' },
    { value: 'grooming', label: 'Grooming' },
  ];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time for your appointment');
      return;
    }

    setLoading(true);
    try {
      // Get the first pet for the user (in a real app, you might want to select a specific pet)
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('id')
        .single();

      if (petError) throw petError;

      // Insert the appointment
      const { error } = await supabase
        .from('appointments')
        .insert({
          pet_id: petData.id,
          vet_name: 'Dr. Sarah Johnson', // This would be selected in a real app
          date: selectedDate,
          time: selectedTime,
          type: appointmentType,
          status: 'upcoming',
          notes: notes,
        });

      if (error) throw error;

      alert('Appointment booked successfully!');
      router.back();
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Error booking appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Book Appointment',
          headerShown: true,
        }}
      />

      <ScrollView style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Book a New Appointment
        </Text>

        <Card style={styles.card}>
          <Card.Title title="Appointment Type" />
          <Card.Content>
            <RadioButton.Group
              onValueChange={value => setAppointmentType(value)}
              value={appointmentType}
            >
              {appointmentTypes.map((type) => (
                <RadioButton.Item
                  key={type.value}
                  label={type.label}
                  value={type.value}
                />
              ))}
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Select Date" />
          <Card.Content>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.dateContainer}>
                {availableDates.map((date) => (
                  <Chip
                    key={date.date}
                    selected={selectedDate === date.date}
                    onPress={() => setSelectedDate(date.date)}
                    style={styles.chip}
                    mode="outlined"
                  >
                    {date.label}
                  </Chip>
                ))}
              </View>
            </ScrollView>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Select Time" />
          <Card.Content>
            <View style={styles.timeContainer}>
              {availableTimes.map((time) => (
                <Chip
                  key={time.time}
                  selected={selectedTime === time.time}
                  onPress={() => setSelectedTime(time.time)}
                  style={styles.chip}
                  mode="outlined"
                >
                  {time.label}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Additional Notes" />
          <Card.Content>
            <TextInput
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes or concerns for the vet..."
              style={styles.notesInput}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleBookAppointment}
          loading={loading}
          style={styles.bookButton}
        >
          Book Appointment
        </Button>
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
  title: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    margin: 4,
  },
  notesInput: {
    backgroundColor: 'transparent',
  },
  bookButton: {
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 20,
  },
});