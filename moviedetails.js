import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Button, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const API_KEY = 'da88cd8c747f0c0132b5875c29e15194';

const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
        setMovie(movieResponse.data);

        const castResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`);
        setCast(castResponse.data.cast);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovieDetails();
  }, [id]);

  if (!movie) return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }}
        style={styles.poster}
      />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.overview}>{movie.overview}</Text>
      <Text style={styles.castTitle}>Cast:</Text>
      <FlatList
        data={cast.slice(0, 10)}
        keyExtractor={(item) => item.cast_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.actorContainer}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500/${item.profile_path}` }}
              style={styles.actorImage}
            />
            <Text style={styles.actorName}>{item.name}</Text>
          </View>
        )}
        horizontal
        contentContainerStyle={styles.castList}
      />
      <Button
        title="Back to Movies"
        onPress={() => navigation.navigate('MovieList')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poster: {
    width: 300,
    height: 450,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overview: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  castTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  castList: {
    alignItems: 'center',
  },
  actorContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  actorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 4,
  },
  actorName: {
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieDetails;