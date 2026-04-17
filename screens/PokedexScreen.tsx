import React, { use, useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

export const PokedexScreen = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [errorLoading, setErrorLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const list = await getPokemons(30); // primeiros 30 pokemons
      list.length <= 0 && setErrorLoading(true);
    //   if (list.length <= 0) setErrorLoading(true);
      const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
      setPokemons(details);
    };
    fetchData();
  }, []);

  const filtered = pokemons.filter(p => p.name.includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>
      <TextInput
        placeholder="Buscar pokémon..."
        style={styles.input}
        onChangeText={setSearch}
      />
      {
        pokemons.length <= 0 && 
        <ActivityIndicator></ActivityIndicator>
      }
      {
        errorLoading &&
        <Text style={styles.title}>Falha ao carregar Pokémons. Verifique sua conexão.</Text>
      }
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
});
