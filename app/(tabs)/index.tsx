import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, Surface, ActivityIndicator } from 'react-native-paper';
import { Stack, router } from 'expo-router';
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
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#F44336',
  },
  retryButton: {
    marginTop: 8,
  },
});

export default function HomeScreen() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError('Failed to load dashboard data. Please try again later.');
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
      ) : error ? (
        <View style={[styles.content, styles.centered]}>
          <Text variant="bodyLarge" style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={fetchDashboardData} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      ) : (
        <ScrollView style={styles.content}>
        {!dashboardData.pet ? (
          <Card style={styles.card}>
            <Card.Content style={styles.centered}>
              <Avatar.Icon size={80} icon="paw" style={{ marginBottom: 16 }} />
              <Text variant="headlineSmall" style={styles.welcomeText}>
                Welcome to FurrChum!
              </Text>
              <Text variant="bodyMedium" style={[styles.welcomeText, { marginBottom: 16 }]}>
                It looks like you haven&apos;t added a pet yet.
              </Text>
              <Button 
                mode="contained" 
                onPress={() => router.push('/pet-profile')}
                style={{ marginBottom: 8 }}
              >
                Add Your Pet
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <>
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
          </>
        )}

        {dashboardData.pet && (
          <>
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                icon={() => <IconSymbol size={24} name="calendar" color="white" />}
                onPress={() => router.push('/book-appointment')}
                style={styles.actionButton}
              >
                Book Appointment
              </Button>
              <Button
                mode="contained"
                icon={() => <IconSymbol size={24} name="video" color="white" />}
                onPress={() => router.push('/book-consultation')}
                style={styles.actionButton}
              >
                Start Video Call
              </Button>
            </View>

            {/* Next Appointment Card */}
            {dashboardData.nextAppointment ? (
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
                <Card.Actions>
                  <Button onPress={() => router.push({
                    pathname: '/appointment-details',
                    params: { id: dashboardData.nextAppointment.id }
                  })}>
                    View Details
                  </Button>
                </Card.Actions>
              </Card>
            ) : (
              <Card style={styles.card}>
                <Card.Content style={styles.centered}>
                  <Avatar.Icon size={60} icon="calendar" style={{ marginBottom: 16 }} />
                  <Text variant="titleMedium" style={styles.welcomeText}>
                    No Upcoming Appointments
                  </Text>
                  <Text variant="bodyMedium" style={[styles.welcomeText, { marginBottom: 16 }]}>
                    Schedule a check-up for {dashboardData.pet?.name || 'your pet'}
                  </Text>
                  <Button 
                    mode="contained" 
                    onPress={() => router.push('/book-appointment')}
                  >
                    Book Now
                  </Button>
                </Card.Content>
              </Card>
            )}

            {/* Next Vaccination Card */}
            {dashboardData.pet?.next_vaccination ? (
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
                <Card.Actions>
                  <Button onPress={() => router.push('/book-appointment')}>
                    Schedule Vaccination
                  </Button>
                </Card.Actions>
              </Card>
            ) : (
              <Card style={styles.card}>
                <Card.Title
                  title="Pet Care Tip"
                  left={(props) => <Avatar.Icon {...props} icon="lightbulb" />}
                />
                <Card.Content>
                  <Text variant="titleMedium">Regular Check-ups</Text>
                  <Text variant="bodyMedium">
                    Regular veterinary check-ups are essential for your pet&apos;s health. 
                    Experts recommend at least one check-up per year for adult pets and 
                    twice a year for senior pets.
                  </Text>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => router.push('/explore')}>
                    More Tips
                  </Button>
                </Card.Actions>
              </Card>
            )}
          </>
        )}
      </ScrollView>
      )}
    </View>
  );
}
