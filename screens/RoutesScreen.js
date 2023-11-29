import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RoutesScreen = () => {
  const [routes, setRoutes] = useState([]);
  const [routeName, setRouteName] = useState('');
  const [routeDate, setRouteDate] = useState('');
  const [routeTime, setRouteTime] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const routesData = await AsyncStorage.getItem('@routes');
      if (routesData !== null) {
        setRoutes(JSON.parse(routesData));
      }
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  };

  const saveRoute = async () => {
    if (routeName.trim() === '' || routeDate.trim() === '' || routeTime.trim() === '') {
      Alert.alert('Error', 'Preencha todos os campos');
      return;
    }

    const newRoute = {
      id: selectedId !== null ? selectedId : Date.now().toString(),
      name: routeName.trim(),
      date: routeDate.trim(),
      time: routeTime.trim(),
    };

    let updatedRoutes = [...routes];

    if (selectedId !== null) {
      updatedRoutes = updatedRoutes.map(route =>
        route.id === selectedId ? newRoute : route
      );
    } else {
      updatedRoutes.push(newRoute);
    }

    try {
      await AsyncStorage.setItem('@routes', JSON.stringify(updatedRoutes));
      setRoutes(updatedRoutes);
      setRouteName('');
      setRouteDate('');
      setRouteTime('');
      setSelectedId(null);
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  const deleteRoute = async (id) => {
    const updatedRoutes = routes.filter(route => route.id !== id);
    try {
      await AsyncStorage.setItem('@routes', JSON.stringify(updatedRoutes));
      setRoutes(updatedRoutes);
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const editRoute = (id) => {
    const selectedRoute = routes.find(route => route.id === id);
    setRouteName(selectedRoute.name);
    setRouteDate(selectedRoute.date);
    setRouteTime(selectedRoute.time);
    setSelectedId(id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Text>{`Data: ${item.date} - Hora: ${item.time}`}</Text>
      <Button title="Edit" onPress={() => editRoute(item.id)} />
      <Button title="Delete" onPress={() => deleteRoute(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome do roteiro"
        value={routeName}
        onChangeText={text => setRouteName(text)}
        style={[styles.input, { borderColor: 'black' }]}
      />
      <TextInput
        placeholder="Data do roteiro"
        value={routeDate}
        onChangeText={text => setRouteDate(text)}
        style={[styles.input, { borderColor: 'black' }]}
      />
      <TextInput
        placeholder="Horário do roteiro"
        value={routeTime}
        onChangeText={text => setRouteTime(text)}
        style={[styles.input, { borderColor: 'black' }]}
      />
      <Button title="Adicionar" onPress={saveRoute} />
      <FlatList
        data={routes}
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

export default RoutesScreen;
