import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import PokemonList from "./PokemonList";
import DetailedPokemonInfo from "./DetailedPokemonInfo";

function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const [popupTop, setPopupTop] = useState("50%");

  useEffect(() => {
    const handleScroll = () => {
      if (isPopupVisible) {
        setPopupTop(`calc(50% + ${window.scrollY}px)`);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isPopupVisible]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
        const pokemonData = await Promise.all(response.data.results.map(async (p) => {
          const pokemonDetailResponse = await axios.get(p.url);

          const stats = pokemonDetailResponse.data.stats.map(stat => ({
            name: stat.stat.name,
            value: stat.base_stat,
          }));

          const abilities = pokemonDetailResponse.data.abilities.map(ability => ability.ability.name);

          const types = pokemonDetailResponse.data.types.map(type => type.type.name);
          const id = pokemonDetailResponse.data.id;

          const speciesResponse = await axios.get(pokemonDetailResponse.data.species.url);
          const flavorTextEntries = speciesResponse.data.flavor_text_entries.filter(entry => entry.language.name === "en");

          return {
            id,
            name: capitalizeFirstLetter(p.name),
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            types,
            species: {
              url: pokemonDetailResponse.data.species.url,
            },
            moves: {
              url: pokemonDetailResponse.data.moves.url,
            },
            stats,
            abilities,
            pokedexEntries: flavorTextEntries.map(entry => entry.flavor_text),
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

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchValue) ||
      pokemon.types.some(type => type.includes(searchValue))
    );

    setFilteredPokemon(filtered);
    setSelectedPokemon(null);
  };

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon({ ...pokemon });
    setPopupVisible(true);
    window.scrollTo({
      top: 0,
      behavior: "auto", // change auto or smooth
    });
  
  };

  const handleBackClick = () => {
    setSelectedPokemon(null);
    setPopupVisible(false);
  };

  const handleNextClick = () => {
    const currentIndex = allPokemon.findIndex((pokemon) => pokemon.id === selectedPokemon.id);
    const nextIndex = (currentIndex + 1) % allPokemon.length;
    setSelectedPokemon({ ...allPokemon[nextIndex] });
  };

  const handlePreviousClick = () => {
    const currentIndex = allPokemon.findIndex((pokemon) => pokemon.id === selectedPokemon.id);
    const previousIndex = (currentIndex - 1 + allPokemon.length) % allPokemon.length;
    setSelectedPokemon({ ...allPokemon[previousIndex] });
  };

  return (
    <>
      <Header />
  <div style={{ textAlign: 'center', padding: '16px 0' }}>
    <input
      type="text"
      placeholder="Search Pokémon or Type..."
      value={searchTerm}
      onChange={handleSearch}
    />
      </div>
      {selectedPokemon && (
        <>
          {isPopupVisible && (
            <div className="overlay">
              <div
                className="popup-content"
                style={{ top: popupTop }}
              >
                <DetailedPokemonInfo
                  selectedPokemon={selectedPokemon}
                  onBackClick={handleBackClick}
                  onPreviousClick={handlePreviousClick}
                  onNextClick={handleNextClick}
                />
              </div>
            </div>
          )}
        </>
      )}
      <PokemonList pokemon={filteredPokemon} onPokemonClick={handlePokemonClick} />
    </>
  );
}

export default App;
