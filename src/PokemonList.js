import React from "react";
import "./PokemonList.css";

const PokemonList = ({ pokemon }) => {
  return (
    <div className="pokemon-list">
      {pokemon.map((pokeData, index) => (
        <div key={index} className="pokemon-square">
          <img src={pokeData.sprite} alt={pokeData.name} />
          <p>{pokeData.name}</p>
        </div>
      ))}
    </div>
  );
};

export default PokemonList;
