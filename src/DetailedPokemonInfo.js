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
  const [abilities, setAbilities] = useState([]);

  useEffect(() => {
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

   
    if (selectedPokemon) {
      fetchEvolutionChain();
      fetchAbilities();
    }
  }, [selectedPokemon]);

  const getStatPercentage = (statValue) => {
    //mess with this to make the pokemon stats look more green or not
    const maxStatValue = 70;
    const fullWidth = 50; // 
    const percentage = (statValue / maxStatValue) * fullWidth;
    return Math.max(percentage, 10);
  };

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

      <div>
        <h3>Abilities:</h3>
        <ul>
          {abilities.map((ability, index) => (
            <li key={index}>{capitalizeEachWord(ability.name)}</li>
          ))}
        </ul>

        <h3>Individual Stats:</h3>
        <ul>
          {selectedPokemon.stats.map((stat, index) => (
            <li key={index}>
              {capitalizeEachWord(stat.name)}: {stat.value}
              <div style={{ width: "50%", backgroundColor: "#ddd", borderRadius: "5px", marginTop: "5px" }}>
                <div
                  style={{
                    width: `${getStatPercentage(stat.value)}%`,
                    height: "20px",
                    backgroundColor: "#4CAF50",
                    borderRadius: "5px",
                  }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onBackClick}>Back to Pokedex</button>
      <button onClick={onPreviousClick}>Previous Pokemon</button>
      <button onClick={onNextClick}>Next Pokemon</button>
    </div>
  );
}

export default DetailedPokemonInfo;
