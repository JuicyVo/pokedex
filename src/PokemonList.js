import React from "react";
import "./PokemonList.css"; 

function capitalizeEachWord(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getTypeIconSrc(type) {
  const iconPath = `/icons/pokemon/types/${type}.png`;
  // console.log('Icon Path:', iconPath);
  return iconPath;
}



function PokemonList({ pokemon, onPokemonClick }) {
  return (
    <div className="pokemon-list">
      {pokemon.map((p) => (
        <div
          key={p.id}
          className="pokemon-card"
          onClick={() => onPokemonClick(p)}
          type={p.types[0]}
        >
          <img src={p.sprite} alt={p.name} className="pokemon-image" />
          <h3 className="pokemon-name" style={{ marginTop: '8px' }}>
            {p.name}
          </h3>
          <div className="types" style={{ marginTop: '8px' }}>
            {p.types.map((type) => (
              <img
                key={type}
                src={getTypeIconSrc(type)}
                alt={type}
                style={{ maxWidth: '24px', height: 'auto', marginRight: '4px' }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PokemonList;
