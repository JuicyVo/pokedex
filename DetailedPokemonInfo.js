
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DetailedPokemonInfo({ match }) {
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const { params: { id } } = match;

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemonDetails(response.data);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error.message);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (!pokemonDetails) {
    return <p>Loading...</p>;
  }



  return (
    <div>
      <h2>{pokemonDetails.name}</h2>
      {/* Render other details like moves, pokedex entries later*/}
    </div>
  );
}

export default DetailedPokemonInfo;
