import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExperiencesScreen = () => {
  const [experiences, setExperiences] = useState([]);
  const [experienceName, setExperienceName] = useState('');
  const [tip, setTip] = useState('');
  const [place, setPlace] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const experiencesData = await AsyncStorage.getItem('@experiences');
      if (experiencesData !== null) {
        setExperiences(JSON.parse(experiencesData));
      }
    } catch (error) {
      console.error('Error loading experiences:', error);
    }
  };

  const saveExperience = async (type) => {
    if (experienceName.trim() === '') {
      Alert.alert('Error', 'Coloque uma experiência');
      return;
    }

    const newExperience = {
      id: selectedId !== null ? selectedId : Date.now().toString(),
      name: experienceName.trim(),
      type: type,
      tip: type === 'Dica' ? tip : '',
      place: type === 'Lugar' ? place : '',
    };

    let updatedExperiences = [...experiences];

    if (selectedId !== null) {
      updatedExperiences = updatedExperiences.map(exp =>
        exp.id === selectedId ? newExperience : exp
      );
    } else {
      updatedExperiences.push(newExperience);
    }

    try {
      await AsyncStorage.setItem('@experiences', JSON.stringify(updatedExperiences));
      setExperiences(updatedExperiences);
      setExperienceName('');
      setTip('');
      setPlace('');
      setSelectedId(null);
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const deleteExperience = async (id) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    try {
      await AsyncStorage.setItem('@experiences', JSON.stringify(updatedExperiences));
      setExperiences(updatedExperiences);
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const editExperience = (item) => {
    setSelectedId(item.id);
    setExperienceName(item.name);
    if (item.type === 'Dica') {
      setTip(item.tip);
      setPlace('');
    } else if (item.type === 'Lugar') {
      setTip('');
      setPlace(item.place);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Button title="Edit" onPress={() => editExperience(item)} />
      <Button title="Delete" onPress={() => deleteExperience(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Coloque sua experiência"
        value={experienceName}
        onChangeText={text => setExperienceName(text)}
        style={[styles.input, { borderColor: 'black' }]}
      />
      <TextInput
        placeholder="Dica"
        value={tip}
        onChangeText={text => setTip(text)}
        style={[styles.input, { borderColor: 'black' }]}
      />
      <TextInput
        placeholder="Lugar"
        value={place}
        onChangeText={text => setPlace(text)}
        style={[styles.input, { borderColor: 'black' }]}
      />
      <Button title="Adicionar experiência" onPress={() => saveExperience('Coloque sua experiência')} color="green" />
      <Button title="Adicionar Lugar" onPress={() => saveExperience('Dica')} color="green" />
      <Button title="Adicionar Dica" onPress={() => saveExperience('Lugar')} color="" />
      <FlatList
        data={experiences}
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
    backgroundColor: 'lightgray',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color: 'black',
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

export default ExperiencesScreen;




