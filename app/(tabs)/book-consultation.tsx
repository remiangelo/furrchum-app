import { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, Chip, RadioButton, Divider } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function BookConsultationScreen() {
  const [consultationType, setConsultationType] = useState('general');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedVet, setSelectedVet] = useState('');
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

  const consultationTypes = [
    { value: 'general', label: 'General Consultation' },
    { value: 'follow-up', label: 'Follow-up Visit' },
    { value: 'emergency', label: 'Emergency Consultation' },
    { value: 'behavior', label: 'Behavior Consultation' },
    { value: 'nutrition', label: 'Nutrition Consultation' },
  ];

  const availableVets = [
    { id: '1', name: 'Dr. Sarah Johnson', specialty: 'General Practice' },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Surgery' },
    { id: '3', name: 'Dr. Emily Rodriguez', specialty: 'Dermatology' },
    { id: '4', name: 'Dr. David Kim', specialty: 'Internal Medicine' },
  ];

  const handleBookConsultation = async () => {
    if (!selectedDate || !selectedTime || !selectedVet) {
      alert('Please select a date, time, and veterinarian for your consultation');
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

      // Generate a mock video call room URL
      const roomUrl = `https://meet.furrchum.com/${Math.random().toString(36).substring(2, 15)}`;

      // Insert the video call
      const { data, error } = await supabase
        .from('video_calls')
        .insert({
          pet_id: petData.id,
          vet_name: availableVets.find(vet => vet.id === selectedVet)?.name,
          date: selectedDate,
          time: selectedTime,
          type: consultationType,
          status: 'scheduled',
          notes: notes,
          room_url: roomUrl,
          start_time: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      alert('Video consultation booked successfully!');
      router.back();
    } catch (error) {
      console.error('Error booking consultation:', error);
      alert('Error booking consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Book Video Consultation',
          headerShown: true,
        }}
      />

      <ScrollView style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Book a Video Consultation
        </Text>

        <Card style={styles.card}>
          <Card.Title title="Consultation Type" />
          <Card.Content>
            <RadioButton.Group
              onValueChange={value => setConsultationType(value)}
              value={consultationType}
            >
              {consultationTypes.map((type) => (
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
          <Card.Title title="Select Veterinarian" />
          <Card.Content>
            {availableVets.map((vet) => (
              <RadioButton.Item
                key={vet.id}
                label={`${vet.name} (${vet.specialty})`}
                value={vet.id}
                status={selectedVet === vet.id ? 'checked' : 'unchecked'}
                onPress={() => setSelectedVet(vet.id)}
              />
            ))}
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
          <Card.Title title="Reason for Consultation" />
          <Card.Content>
            <TextInput
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              placeholder="Describe your pet's symptoms or concerns..."
              style={styles.notesInput}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleBookConsultation}
          loading={loading}
          style={styles.bookButton}
        >
          Book Consultation
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