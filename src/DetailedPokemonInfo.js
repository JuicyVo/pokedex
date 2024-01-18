import React, { useState, useEffect } from "react";
import axios from "axios";

function capitalizeEachWord(str) {
  return str
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


function DetailedPokemonInfo({ selectedPokemon, onBackClick, onPreviousClick, onNextClick }) {
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [moveset, setMoveset] = useState([]);
  const [baseStatTotal, setBaseStatTotal] = useState(null);
  const [individualStats, setIndividualStats] = useState([]);
  const [abilities, setAbilities] = useState([]);

  useEffect(() => {

const fetchAbilities = async () => {
  try {
    if (selectedPokemon?.abilities && Array.isArray(selectedPokemon.abilities)) {
      const abilitiesData = selectedPokemon.abilities;

      console.log("Abilities Data:", abilitiesData);

      setAbilities(abilitiesData);
    } else {
      console.error("Abilities information is not available.");
    }
  } catch (error) {
    console.error("Error fetching abilities:", error.message);
  }
};

    
    const fetchEvolutionChain = async () => {
      try {
        const response = await axios.get(selectedPokemon.species.url);
        const evolutionChainUrl = response.data.evolution_chain.url;
        const evolutionResponse = await axios.get(evolutionChainUrl);
        const chain = evolutionResponse.data.chain;
        const evolutionDetails = [];
        let currentPokemon = chain;

        while (currentPokemon) {
          evolutionDetails.push({
            name: currentPokemon.species.name,
            id: currentPokemon.species.url.split("/").reverse()[1],
          });

          if (currentPokemon.evolves_to.length > 0) {
            currentPokemon = currentPokemon.evolves_to[0];
          } else {
            currentPokemon = null;
          }
        }

        setEvolutionChain(evolutionDetails);
      } catch (error) {
        console.error("Error fetching evolution chain:", error.message);
      }
    };

    const fetchMoveset = async () => {
      try {
        if (selectedPokemon && selectedPokemon.moves && selectedPokemon.moves.url) {
          console.log("Moves URL:", selectedPokemon.moves.url);
          const response = await axios.get(selectedPokemon.moves.url);
          console.log("Moveset response:", response.data);
          const moves = response.data.moves.slice(0, 5).map((move) => move.move.name);
          setMoveset(moves);
        } else {
          console.error("Moveset information is not available.");
        }
      } catch (error) {
        console.error("Error fetching moveset:", error.message);
      }
    };

    const fetchPokemonDetails = async () => {
      try {
        if (selectedPokemon && selectedPokemon.url) {
          console.log("Pokemon URL:", selectedPokemon.url);
          const response = await axios.get(selectedPokemon.url);
          console.log("Pokemon details response:", response.data);
          setBaseStatTotal(response.data.base_experience);
          setIndividualStats(response.data.stats);
        } else {
          console.error("Pokemon details information is not available.");
        }
      } catch (error) {
        console.error("Error fetching Pokemon details:", error.message);
      }
    };

    // Call the data-fetching functions when selectedPokemon changes
    if (selectedPokemon) {
      fetchEvolutionChain();
      fetchMoveset();
      fetchPokemonDetails();
    }
  }, [selectedPokemon]);

  useEffect(() => {
    const fetchAbilities = async () => {
      try {
        if (selectedPokemon?.abilities && Array.isArray(selectedPokemon.abilities)) {
          const abilitiesData = selectedPokemon.abilities.map((ability) => {
            return {
              name: capitalizeEachWord(ability.ability.name),
              isHidden: ability.is_hidden,
              slot: ability.slot,
            };
          });
    
          console.log("Abilities Data:", abilitiesData);
    
          setAbilities(abilitiesData);
        }
      } catch (error) {
        console.error("Error fetching abilities:", error.message);
      }
    };

    // Fetch abilities when selectedPokemon changes
    if (selectedPokemon) {
      fetchAbilities();
    }
  }, [selectedPokemon]);

  return (
    <div>
      <h2>{selectedPokemon.name}</h2>
      <img src={selectedPokemon.sprite} alt={selectedPokemon.name} />
      <h3>Evolution Chain:</h3>
      <ul>
        {evolutionChain.map((evolution) => (
          <li key={evolution.id}>{capitalizeEachWord(evolution.name)}</li>
        ))}
      </ul>
      <h3>Moveset:</h3>
      <ul>
        {moveset.map((move, index) => (
          <li key={index}>{capitalizeEachWord(move)}</li>
        ))}
      </ul>
      <h3>Base Stat Total: {baseStatTotal}</h3>
      <div>
        <h3>Abilities:</h3>
        
        <ul>
        {selectedPokemon.abilities.map((ability, index) => (
          <li key={index}>
            {capitalizeEachWord(ability)}
          </li>
        ))}
      

        </ul>

        <h3>Individual Stats:</h3>
      <ul>
        <li>HP: {selectedPokemon.stats.find(stat => stat.name === 'hp').value}</li>
        <li>Attack: {selectedPokemon.stats.find(stat => stat.name === 'attack').value}</li>
        <li>Defense: {selectedPokemon.stats.find(stat => stat.name === 'defense').value}</li>
        <li>Special Attack: {selectedPokemon.stats.find(stat => stat.name === 'special-attack').value}</li>
        <li>Special Defense: {selectedPokemon.stats.find(stat => stat.name === 'special-defense').value}</li>
        <li>Speed: {selectedPokemon.stats.find(stat => stat.name === 'speed').value}</li>
      </ul>
      </div>

      <button onClick={onBackClick}>Back to Pokedex</button>
      <button onClick={onPreviousClick}>Previous Pokemon</button>
      <button onClick={onNextClick}>Next Pokemon</button>
    </div>
  );
}

export default DetailedPokemonInfo;
