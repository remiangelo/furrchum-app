import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, Searchbar, Chip, Divider } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'vets', name: 'Veterinarians', icon: 'doctor' },
    { id: 'services', name: 'Services', icon: 'medical-bag' },
    { id: 'tips', name: 'Pet Care Tips', icon: 'lightbulb' },
    { id: 'stores', name: 'Pet Stores', icon: 'store' },
    { id: 'parks', name: 'Pet Parks', icon: 'tree' },
  ];

  const featuredVets = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'General Practice',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300',
      distance: '1.2 miles',
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Surgery',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300',
      distance: '2.5 miles',
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300',
      distance: '3.1 miles',
    },
  ];

  const petCareServices = [
    {
      id: '1',
      name: 'Grooming',
      description: 'Professional pet grooming services',
      icon: 'scissors-cutting',
    },
    {
      id: '2',
      name: 'Boarding',
      description: 'Safe and comfortable pet boarding',
      icon: 'home',
    },
    {
      id: '3',
      name: 'Training',
      description: 'Behavior training for dogs and cats',
      icon: 'school',
    },
    {
      id: '4',
      name: 'Pet Sitting',
      description: 'In-home pet sitting services',
      icon: 'account-heart',
    },
  ];

  const petCareTips = [
    {
      id: '1',
      title: 'Healthy Diet Tips',
      description: 'Learn about the best diet for your pet breed and age',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=300',
    },
    {
      id: '2',
      title: 'Exercise Routines',
      description: 'Keep your pet active with these exercise recommendations',
      image: 'https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?q=80&w=300',
    },
    {
      id: '3',
      title: 'Dental Care Guide',
      description: 'Tips for maintaining your pet dental health',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=300',
    },
  ];

  const renderContent = () => {
    if (selectedCategory === 'vets') {
      return (
        <View>
          <Text variant="titleLarge" style={styles.sectionTitle}>Veterinarians Near You</Text>
          {featuredVets.map((vet) => (
            <Card key={vet.id} style={styles.vetCard}>
              <Card.Content style={styles.vetCardContent}>
                <Image source={{ uri: vet.image }} style={styles.vetImage} />
                <View style={styles.vetInfo}>
                  <Text variant="titleMedium">{vet.name}</Text>
                  <Text variant="bodyMedium">{vet.specialty}</Text>
                  <View style={styles.vetMeta}>
                    <Text variant="bodySmall">⭐ {vet.rating}</Text>
                    <Text variant="bodySmall">📍 {vet.distance}</Text>
                  </View>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => alert(`Book appointment with ${vet.name}`)}>
                  Book Appointment
                </Button>
                <Button onPress={() => alert(`View profile of ${vet.name}`)}>
                  View Profile
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      );
    } else if (selectedCategory === 'services') {
      return (
        <View>
          <Text variant="titleLarge" style={styles.sectionTitle}>Pet Care Services</Text>
          <View style={styles.servicesGrid}>
            {petCareServices.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.serviceItem}
                onPress={() => alert(`View ${service.name} services`)}
              >
                <IconSymbol size={40} name={service.icon} color="#4CAF50" />
                <Text variant="titleSmall" style={styles.serviceTitle}>{service.name}</Text>
                <Text variant="bodySmall" style={styles.serviceDescription}>{service.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else if (selectedCategory === 'tips') {
      return (
        <View>
          <Text variant="titleLarge" style={styles.sectionTitle}>Pet Care Tips</Text>
          {petCareTips.map((tip) => (
            <Card key={tip.id} style={styles.tipCard}>
              <Card.Cover source={{ uri: tip.image }} style={styles.tipImage} />
              <Card.Content>
                <Text variant="titleMedium">{tip.title}</Text>
                <Text variant="bodyMedium">{tip.description}</Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => alert(`Read more about ${tip.title}`)}>
                  Read More
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      );
    } else {
      // Default view with all categories
      return (
        <View>
          <Text variant="titleLarge" style={styles.sectionTitle}>Featured Veterinarians</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {featuredVets.map((vet) => (
              <Card key={vet.id} style={styles.horizontalCard}>
                <Card.Cover source={{ uri: vet.image }} style={styles.horizontalCardImage} />
                <Card.Content>
                  <Text variant="titleMedium">{vet.name}</Text>
                  <Text variant="bodyMedium">{vet.specialty}</Text>
                  <Text variant="bodySmall">⭐ {vet.rating}</Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>

          <Divider style={styles.divider} />

          <Text variant="titleLarge" style={styles.sectionTitle}>Popular Services</Text>
          <View style={styles.servicesRow}>
            {petCareServices.slice(0, 3).map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.serviceButton}
                onPress={() => setSelectedCategory('services')}
              >
                <IconSymbol size={24} name={service.icon} color="#4CAF50" />
                <Text variant="bodyMedium">{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Divider style={styles.divider} />

          <Text variant="titleLarge" style={styles.sectionTitle}>Pet Care Tips</Text>
          {petCareTips.slice(0, 2).map((tip) => (
            <Card key={tip.id} style={styles.tipCard}>
              <Card.Cover source={{ uri: tip.image }} style={styles.tipImage} />
              <Card.Content>
                <Text variant="titleMedium">{tip.title}</Text>
                <Text variant="bodyMedium">{tip.description}</Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => alert(`Read more about ${tip.title}`)}>
                  Read More
                </Button>
              </Card.Actions>
            </Card>
          ))}
          <Button 
            mode="outlined" 
            onPress={() => setSelectedCategory('tips')}
            style={styles.viewMoreButton}
          >
            View More Tips
          </Button>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Explore',
          headerShown: true,
        }}
      />

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search for vets, services, etc."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              icon={category.icon}
              selected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
              style={styles.categoryChip}
            >
              {category.name}
            </Chip>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    elevation: 2,
  },
  categoriesScroll: {
    maxHeight: 60,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  horizontalCard: {
    width: 200,
    marginRight: 16,
  },
  horizontalCardImage: {
    height: 120,
  },
  vetCard: {
    marginBottom: 16,
  },
  vetCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vetImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  vetInfo: {
    flex: 1,
  },
  vetMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  serviceTitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  serviceDescription: {
    textAlign: 'center',
    marginTop: 4,
    color: '#757575',
  },
  tipCard: {
    marginBottom: 16,
  },
  tipImage: {
    height: 150,
  },
  divider: {
    marginVertical: 16,
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '30%',
  },
  viewMoreButton: {
    marginTop: 8,
    marginBottom: 24,
  },
});