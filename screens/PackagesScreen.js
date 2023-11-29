import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PackagesScreen = () => {
  const [packages, setPackages] = useState([]);
  const [packageName, setPackageName] = useState('');
  const [packageValue, setPackageValue] = useState('');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const packagesData = await AsyncStorage.getItem('@packages');
      if (packagesData !== null) {
        setPackages(JSON.parse(packagesData));
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  };

  const savePackage = async () => {
    if (packageName.trim() === '' || packageValue.trim() === '') {
      Alert.alert('Error', 'Preencha todos os campos');
      return;
    }

    const newPackage = {
      id: Date.now().toString(),
      name: packageName.trim(),
      value: parseFloat(packageValue.trim()), // Convertendo para número
    };

    const updatedPackages = [...packages, newPackage];
    try {
      await AsyncStorage.setItem('@packages', JSON.stringify(updatedPackages));
      setPackages(updatedPackages);
      setPackageName('');
      setPackageValue('');
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const deletePackage = async (id) => {
    const updatedPackages = packages.filter(pack => pack.id !== id);
    try {
      await AsyncStorage.setItem('@packages', JSON.stringify(updatedPackages));
      setPackages(updatedPackages);
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const editPackage = (id) => {
    const selectedPackage = packages.find(pack => pack.id === id);
    setPackageName(selectedPackage.name);
    setPackageValue(selectedPackage.value.toString());
    deletePackage(id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Text>{`R$ ${item.value.toFixed(2)}`}</Text>
      <Button title="Edit" onPress={() => editPackage(item.id)} />
      <Button title="Delete" onPress={() => deletePackage(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome do pacote"
        value={packageName}
        onChangeText={text => setPackageName(text)}
        style={[styles.input, { borderColor: 'black' }]}
      />
      <TextInput
        placeholder="Valor do pacote"
        value={packageValue}
        onChangeText={text => setPackageValue(text)}
        keyboardType="numeric"
        style={[styles.input, { borderColor: 'black' }]}
      />
      <Button title="Adicionar" onPress={savePackage} />
      <FlatList
        data={packages}
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

export default PackagesScreen;

