import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Avatar } from 'react-native-paper';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Image } from 'expo-image';

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  photo_url?: string;
};

export default function EditPetProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPetProfile();
  }, [id]);

  const fetchPetProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .single();

      if (error) throw error;

      setPet(data);
      setName(data.name);
      setSpecies(data.species);
      setBreed(data.breed);
      setAge(data.age.toString());
      setWeight(data.weight.toString());
      setPhotoUrl(data.photo_url || '');
    } catch (error) {
      console.error('Error fetching pet profile:', error);
      alert('Error loading pet profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = () => {
    // In a real app, this would use expo-image-picker to select an image
    // For this example, we'll just use a sample URL
    const samplePhotoUrls = [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
      'https://images.unsplash.com/photo-1548247416-ec66f4900b2e',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5'
    ];

    const randomUrl = samplePhotoUrls[Math.floor(Math.random() * samplePhotoUrls.length)];
    setPhotoUrl(randomUrl);
    alert('Photo updated! In a real app, you would pick from your gallery.');
  };

  const handleSave = async () => {
    if (!name || !species || !breed || !age || !weight) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('pets')
        .update({
          name,
          species,
          breed,
          age: parseInt(age, 10),
          weight: parseFloat(weight),
          photo_url: photoUrl,
        })
        .eq('id', pet?.id);

      if (error) throw error;

      alert('Pet profile updated successfully!');
      router.back();
    } catch (error) {
      console.error('Error updating pet profile:', error);
      alert('Error updating pet profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Edit Pet Profile',
          headerShown: true,
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.photoContainer}>
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={styles.photo}
              contentFit="cover"
            />
          ) : (
            <Avatar.Icon size={120} icon="paw" style={styles.photoPlaceholder} />
          )}
          <Button
            mode="outlined"
            onPress={handlePickImage}
            style={styles.photoButton}
          >
            Change Photo
          </Button>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Pet Name *"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TextInput
              label="Species *"
              value={species}
              onChangeText={setSpecies}
              style={styles.input}
            />

            <TextInput
              label="Breed *"
              value={breed}
              onChangeText={setBreed}
              style={styles.input}
            />

            <TextInput
              label="Age (years) *"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Weight (kg) *"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        >
          Save Changes
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  photoPlaceholder: {
    marginBottom: 10,
  },
  photoButton: {
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 32,
    borderRadius: 20,
  },
});