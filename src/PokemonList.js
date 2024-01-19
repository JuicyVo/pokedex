import React from "react";

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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
      {pokemon.map((p) => (
        <div key={p.id} style={{ textAlign: 'center', padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}
          onClick={() => onPokemonClick(p)}>
          <img src={p.sprite} alt={p.name} style={{ maxWidth: '100%', height: 'auto' }} />
          <h3 style={{ marginTop: '8px' }}>{p.name}</h3>
          <div style={{ marginTop: '8px' }}>
            {p.types.map((type) => (
              <img key={type} src={getTypeIconSrc(type)} alt={type} style={{ maxWidth: '24px', height: 'auto', marginRight: '4px' }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


export default PokemonList;
