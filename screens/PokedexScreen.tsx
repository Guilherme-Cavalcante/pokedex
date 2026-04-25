import React, { use, useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';
import { capitalize } from '../utils/format';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

export const PokedexScreen = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [search, setSearch] = useState('');
    const [errorLoading, setErrorLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [loadingNewPokemons, setLoadingNewPokemons] = useState(true);

    const insets = useSafeAreaInsets();

    useEffect(() => {
        const fetchData = async () => {
            const list = await getPokemons(30, offset); // primeiros 30 pokemons
            list.length <= 0 && setErrorLoading(true);
            const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
            setPokemons(pokemons.concat(details));
        };
        fetchData();
        setLoadingNewPokemons(false);
    }, [offset]);

    const filtered = pokemons.filter(pokemon => pokemon.name.includes(search.toLowerCase()));
    filtered.forEach(pokemon => pokemon.name = capitalize(pokemon.name));

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
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
                <Text style={styles.input}>Falha ao carregar Pokémons. Verifique sua conexão.</Text>
            }
            <FlatList
                data={filtered}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                renderItem={({ item }) => <PokemonCard pokemon={item} />}
                ListEmptyComponent={
                    <Text style={styles.input}>{
                        (search != "" &&
                            `Nenhum Pokémon encontrado para ${search}.`) ??
                        (!loadingNewPokemons &&
                        "Nenhum Pokémon para exibir no momento.")
                    }</Text>
                }
                onEndReached={({ distanceFromEnd = 3 }) => filtered.length >= 27 && !loadingNewPokemons && loadMorePokemons()}
                ListFooterComponent={<ActivityIndicator></ActivityIndicator>}
            />
        </View>
    );

    function loadMorePokemons() {
        setOffset(offset => offset + 30);
        setLoadingNewPokemons(true);
    }
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16 },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
    input: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
});
