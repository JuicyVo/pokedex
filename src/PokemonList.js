import React from "react";

function capitalizeEachWord(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
      {capitalizeEachWord(p.types.join(" "))}
    </div>
  </div>
))}

    </div>
  );
}



export default PokemonList;
