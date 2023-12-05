import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import PokemonList from "./PokemonList";

function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1048");
        const pokemonData = await Promise.all(response.data.results.map(async (p) => {
          const pokemonDetailResponse = await axios.get(p.url);
          const types = pokemonDetailResponse.data.types.map(type => type.type.name);
          return {
            name: p.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.url.split("/")[6]}.png`,
            types: types.join(", "),
          };
        }));
        setAllPokemon(pokemonData);
        setFilteredPokemon(pokemonData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchValue) ||
      pokemon.types.toLowerCase().includes(searchValue)
    );

    setFilteredPokemon(filtered);
  };

  return (
    <>
      <Header />
      <div>
        <input
          type="text"
          placeholder="Search Pokémon or Type..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <PokemonList pokemon={filteredPokemon} />
    </>
  );
}

export default App;
