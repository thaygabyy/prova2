import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReviewsScreen = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewLocation, setReviewLocation] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const reviewsData = await AsyncStorage.getItem('@reviews');
      if (reviewsData !== null) {
        setReviews(JSON.parse(reviewsData));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const saveReview = async () => {
    if (reviewText.trim() === '' || reviewStars === 0 || reviewLocation.trim() === '') {
      Alert.alert('Error', 'Preencha todos os campos');
      return;
    }

    const newReview = {
      id: selectedId !== null ? selectedId : Date.now().toString(),
      text: reviewText.trim(),
      stars: reviewStars,
      location: reviewLocation.trim(),
    };

    let updatedReviews = [...reviews];

    if (selectedId !== null) {
      updatedReviews = updatedReviews.map(review =>
        review.id === selectedId ? newReview : review
      );
    } else {
      updatedReviews.push(newReview);
    }

    try {
      await AsyncStorage.setItem('@reviews', JSON.stringify(updatedReviews));
      setReviews(updatedReviews);
      setReviewText('');
      setReviewStars(0);
      setReviewLocation('');
      setSelectedId(null);
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  const deleteReview = async (id) => {
    const updatedReviews = reviews.filter(review => review.id !== id);
    try {
      await AsyncStorage.setItem('@reviews', JSON.stringify(updatedReviews));
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const editReview = (id) => {
    const selectedReview = reviews.find(review => review.id === id);
    setReviewText(selectedReview.text);
    setReviewStars(selectedReview.stars);
    setReviewLocation(selectedReview.location);
    setSelectedId(id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.text}</Text>
      <Text>{`Local: ${item.location}`}</Text>
      <Text>{`Stars: ${item.stars}`}</Text>
      <Button title="Edit" onPress={() => editReview(item.id)} />
      <Button title="Delete" onPress={() => deleteReview(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome do local"
        value={reviewLocation}
        onChangeText={text => setReviewLocation(text)}
        style={[styles.input, { borderColor: 'black' }]}
      />
      <TextInput
        placeholder="Coloque seu comentário"
        value={reviewText}
        onChangeText={text => setReviewText(text)}
        style={[styles.input, { borderColor: 'black' }]}
      />
      <TextInput
        placeholder="Avalie com estrelas (1-5)"
        value={reviewStars.toString()}
        onChangeText={text => {
          const stars = parseInt(text);
          setReviewStars(stars >= 1 && stars <= 5 ? stars : 0);
        }}
        keyboardType="numeric"
        style={[styles.input, { borderColor: 'black' }]}
      />
      <Button title="Adicionar" onPress={saveReview} />
      <FlatList
        data={reviews}
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

export default ReviewsScreen;


