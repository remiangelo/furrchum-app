import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, Surface, ActivityIndicator } from 'react-native-paper';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { supabase } from '../../lib/supabase';
import { IconSymbol } from '@/components/ui/IconSymbol';

type DashboardData = {
  nextAppointment?: {
    id: string;
    vet_name: string;
    date: string;
    time: string;
    type: string;
  };
  pet?: {
    name: string;
    photo_url?: string;
    next_vaccination?: {
      name: string;
      due_date: string;
    };
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  welcomeText: {
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  card: {
    marginBottom: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function HomeScreen() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // Fetch next appointment
      const { data: appointmentData } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', 'upcoming')
        .order('date', { ascending: true })
        .limit(1)
        .single();

      // Fetch pet data
      const { data: petData } = await supabase
        .from('pets')
        .select(`
          name,
          photo_url,
          vaccinations (name, next_due)
        `)
        .single();

      setDashboardData({
        nextAppointment: appointmentData,
        pet: petData ? {
          name: petData.name,
          photo_url: petData.photo_url,
          next_vaccination: petData.vaccinations?.[0] ? {
            name: petData.vaccinations[0].name,
            due_date: petData.vaccinations[0].next_due,
          } : undefined,
        } : undefined,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'FurrChum',
          headerShown: true,
        }}
      />

      {loading ? (
        <View style={[styles.content, styles.centered]}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
        {/* Welcome Section */}
        <Surface style={styles.welcomeSection}>
          {dashboardData.pet?.photo_url ? (
            <Image
              source={{ uri: dashboardData.pet.photo_url }}
              style={styles.petImage}
              contentFit="cover"
            />
          ) : (
            <Avatar.Icon size={80} icon="paw" />
          )}
          <Text variant="headlineMedium" style={styles.welcomeText}>
            Welcome back, {dashboardData.pet?.name || 'Pet Parent'}!
          </Text>
        </Surface>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            mode="contained"
            icon={() => <IconSymbol size={24} name="calendar" color="white" />}
            onPress={() => {}}
            style={styles.actionButton}
          >
            Book Appointment
          </Button>
          <Button
            mode="contained"
            icon={() => <IconSymbol size={24} name="video" color="white" />}
            onPress={() => {}}
            style={styles.actionButton}
          >
            Start Video Call
          </Button>
        </View>

        {/* Next Appointment Card */}
        {dashboardData.nextAppointment && (
          <Card style={styles.card}>
            <Card.Title
              title="Next Appointment"
              left={(props) => <Avatar.Icon {...props} icon="calendar" />}
            />
            <Card.Content>
              <Text variant="titleMedium">{dashboardData.nextAppointment.vet_name}</Text>
              <Text variant="bodyMedium">{dashboardData.nextAppointment.type}</Text>
              <Text variant="bodyMedium">
                {new Date(dashboardData.nextAppointment.date).toLocaleDateString()} at{' '}
                {dashboardData.nextAppointment.time}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Next Vaccination Card */}
        {dashboardData.pet?.next_vaccination && (
          <Card style={styles.card}>
            <Card.Title
              title="Upcoming Vaccination"
              left={(props) => <Avatar.Icon {...props} icon="needle" />}
            />
            <Card.Content>
              <Text variant="titleMedium">{dashboardData.pet.next_vaccination.name}</Text>
              <Text variant="bodyMedium">
                Due: {new Date(dashboardData.pet.next_vaccination.due_date).toLocaleDateString()}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
      )}
    </View>
  );
}
