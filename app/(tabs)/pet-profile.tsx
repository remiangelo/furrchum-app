import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, Card, Avatar, List, Divider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Image } from 'expo-image';

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  photo_url: string;
  medical_history: {
    condition: string;
    diagnosis_date: string;
  }[];
  vaccinations: {
    name: string;
    date: string;
    next_due: string;
  }[];
};

export default function PetProfileScreen() {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch pet profile from Supabase
  const fetchPetProfile = async () => {
    try {
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('*')
        .single();

      if (petError) throw petError;

      // Fetch related medical history
      const { data: medicalData, error: medicalError } = await supabase
        .from('medical_history')
        .select('*')
        .eq('pet_id', petData.id);

      if (medicalError) throw medicalError;

      // Fetch vaccinations
      const { data: vaccinationData, error: vaccinationError } = await supabase
        .from('vaccinations')
        .select('*')
        .eq('pet_id', petData.id);

      if (vaccinationError) throw vaccinationError;

      setPet({
        ...petData,
        medical_history: medicalData || [],
        vaccinations: vaccinationData || [],
      });
    } catch (error) {
      console.error('Error fetching pet profile:', error);
      alert('Error loading pet profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetProfile();
  }, []);

  if (loading || !pet) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Pet Profile',
          headerShown: true,
        }}
      />

      <ScrollView style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.header}>
            {pet.photo_url ? (
              <Image
                source={{ uri: pet.photo_url }}
                style={styles.profileImage}
                contentFit="cover"
              />
            ) : (
              <Avatar.Icon size={100} icon="paw" />
            )}
            <View style={styles.profileInfo}>
              <Text variant="headlineMedium">{pet.name}</Text>
              <Text variant="bodyLarge">{pet.breed}</Text>
              <Text variant="bodyMedium">{pet.species}</Text>
            </View>
          </View>

          <Card.Content>
            <List.Section>
              <List.Subheader>Basic Information</List.Subheader>
              <List.Item
                title="Age"
                description={\`\${pet.age} years\`}
                left={props => <List.Icon {...props} icon="calendar" />}
              />
              <List.Item
                title="Weight"
                description={\`\${pet.weight} kg\`}
                left={props => <List.Icon {...props} icon="scale" />}
              />
            </List.Section>

            <Divider />

            <List.Section>
              <List.Subheader>Medical History</List.Subheader>
              {pet.medical_history.map((record, index) => (
                <List.Item
                  key={index}
                  title={record.condition}
                  description={new Date(record.diagnosis_date).toLocaleDateString()}
                  left={props => <List.Icon {...props} icon="medical-bag" />}
                />
              ))}
            </List.Section>

            <Divider />

            <List.Section>
              <List.Subheader>Vaccinations</List.Subheader>
              {pet.vaccinations.map((vaccine, index) => (
                <List.Item
                  key={index}
                  title={vaccine.name}
                  description={\`Last: \${new Date(vaccine.date).toLocaleDateString()}
Next due: \${new Date(vaccine.next_due).toLocaleDateString()}\`}
                  left={props => <List.Icon {...props} icon="needle" />}
                />
              ))}
            </List.Section>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => {/* TODO: Navigate to edit profile */}}
          style={styles.editButton}
        >
          Edit Profile
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
  profileCard: {
    marginBottom: 16,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInfo: {
    marginLeft: 16,
  },
  editButton: {
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 20,
  },
});
