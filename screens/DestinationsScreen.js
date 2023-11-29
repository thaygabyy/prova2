import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DestinationsScreen = () => {
  const [destinations, setDestinations] = useState([]);
  const [destinationName, setDestinationName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const destinationsData = await AsyncStorage.getItem('@destinations');
      if (destinationsData !== null) {
        setDestinations(JSON.parse(destinationsData));
      }
    } catch (error) {
      console.error('Error loading destinations:', error);
    }
  };

  const saveDestination = async () => {
    if (!destinationName.trim() || !country.trim() || !city.trim()) {
      Alert.alert('Error', 'Preencha todos os campos');
      return;
    }

    const newDestination = {
      id: selectedId !== null ? selectedId : Date.now().toString(),
      name: destinationName.trim(),
      country: country.trim(),
      city: city.trim(),
    };

    let updatedDestinations = [...destinations];

    if (selectedId !== null) {
      updatedDestinations = updatedDestinations.map(dest =>
        dest.id === selectedId ? newDestination : dest
      );
    } else {
      updatedDestinations.push(newDestination);
    }

    try {
      await AsyncStorage.setItem('@destinations', JSON.stringify(updatedDestinations));
      setDestinations(updatedDestinations);
      setDestinationName('');
      setCountry('');
      setCity('');
      setSelectedId(null);
    } catch (error) {
      console.error('Error saving destination:', error);
    }
  };

  const deleteDestination = async (id) => {
    const updatedDestinations = destinations.filter(dest => dest.id !== id);
    try {
      await AsyncStorage.setItem('@destinations', JSON.stringify(updatedDestinations));
      setDestinations(updatedDestinations);
    } catch (error) {
      console.error('Error deleting destination:', error);
    }
  };

  const editDestination = (id) => {
    const selectedDestination = destinations.find(dest => dest.id === id);
    setDestinationName(selectedDestination.name);
    setCountry(selectedDestination.country);
    setCity(selectedDestination.city);
    setSelectedId(id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Text>{item.country}, {item.city}</Text>
      <Button title="Edit" onPress={() => editDestination(item.id)} />
      <Button title="Delete" onPress={() => deleteDestination(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome do destino"
        value={destinationName}
        onChangeText={text => setDestinationName(text)}
        style={[styles.input, { borderColor: 'black' }]}
      />
      <TextInput
        placeholder="País"
        value={country}
        onChangeText={text => setCountry(text)}
        style={[styles.input, { borderColor: 'black' }]}
      />
      <TextInput
        placeholder="Cidade"
        value={city}
        onChangeText={text => setCity(text)}
        style={[styles.input, { borderColor: 'black' }]}
      />
      <Button title="Salvar" onPress={saveDestination} />
      <FlatList
        data={destinations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'lightgrey',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
    width: '95%',
    backgroundColor: 'white',
    marginBottom: 5,
  },
});

export default DestinationsScreen;



