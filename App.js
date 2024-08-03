// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Button, Image, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MovieDetails from '/Users/parth/Desktop/reactapp/moviedetails.js'; // Adjust the path as needed

const API_KEY = 'da88cd8c747f0c0132b5875c29e15194';
const POPULAR_MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

const Stack = createStackNavigator();

const App = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [showWelcomePage, setShowWelcomePage] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (!query && !showWelcomePage && !showSearchResults) {
      fetchPopularMovies();
    }
  }, [page, query, showWelcomePage, showSearchResults]);

  const fetchPopularMovies = async () => {
    try {
      const response = await axios.get(`${POPULAR_MOVIES_URL}&page=${page}`);
      setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.error(err);
    }
  };

  const searchMovies = async () => {
    if (query.trim() === '') return;
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
      setMovies(response.data.results);
      setPage(1);
      setTotalPages(response.data.total_pages);
      setShowSearchResults(true);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMoreMovies = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleEnterClick = () => {
    setShowWelcomePage(false);
  };

  const handleMovieClick = (id) => {
    navigation.navigate('MovieDetails', { id });
  };

  const handleBackToMovies = () => {
    setShowSearchResults(false);
    setQuery('');
    setMovies([]);
    setPage(1);
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {showWelcomePage ? (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome to Movie List App</Text>
          <Button title="Enter" onPress={handleEnterClick} />
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for movies"
              value={query}
              onChangeText={(text) => setQuery(text)}
            />
            <Button title="Search" onPress={searchMovies} />
          </View>
          <FlatList
            data={movies}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleMovieClick(item.id)} style={styles.movieCard}>
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
                  style={styles.movieImage}
                />
                <Text style={styles.movieTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            onEndReached={loadMoreMovies}
            onEndReachedThreshold={0.1}
          />
          {showSearchResults && (
            <Button title="Back to Movies" onPress={handleBackToMovies} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const MovieApp = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={App} />
      <Stack.Screen name="MovieDetails" component={MovieDetails} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 16,
  },
  mainContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
  },
  movieCard: {
    flex: 1,
    margin: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  movieImage: {
    width: '100%',
    height: 200,
  },
  movieTitle: {
    padding: 8,
    textAlign: 'center',
  },
});

export default MovieApp;