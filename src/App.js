import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import InfiniteScroll from 'react-infinite-scroll-component';

function App() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then(response => {
        setPokemonList(response.data.results);
      })
      .catch(error => {
        console.log('Load error:', error);
      });
  }, []);

  const handleInputChange = event => {
    setPokemonName(event.target.value);
  };

  const handleSearch = () => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
      .then(response => {
        setPokemonData(response.data);
      })
      .catch(error => {
        console.log('Load error:', error);
        setPokemonData(null);
      });
  };

  const handleRandomPokemon = () => {
    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    const randomPokemon = pokemonList[randomIndex];
    setPokemonName(randomPokemon.name);
    handleSearch();
  };

  const handleNext = () => {
    axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${pokemonList.length}`)
      .then(response => {
        setPokemonList([...pokemonList, ...response.data.results]);
      })
      .catch(error => {
        console.log('Load error:', error);
      });
  };

  return (
      <div className="flex flex-col items-center">
        <h1 className="text-teal-400 text-xl">Pokemon Search</h1>
        <input type="text" value={pokemonName} onChange={handleInputChange} placeholder="Enter Pokemon Name" className="rounded-lg pl-2 text-black" />
        <button onClick={handleSearch} className="text-lg rounded-lg">Search</button>
        <button onClick={handleRandomPokemon} className="rounded-lg mb-2 text-lg">Random Pokemon</button>

        {pokemonData && (
          <div className="flex flex-col items-center">
            <h2>{pokemonData.name}</h2>
            <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
            <p>Types: {pokemonData.types.map(type => type.type.name).join(', ')}</p>
            <p>Stats:</p>
            <ul>
              <li>Hp {pokemonData.stats[[0]].base_stat}</li>
              <li>Attack {pokemonData.stats[[1]].base_stat}</li>
              <li>Defense {pokemonData.stats[[2]].base_stat}</li>
              <li>Special attack {pokemonData.stats[[3]].base_stat}</li>
              <li>Special defense {pokemonData.stats[[4]].base_stat}</li>
              <li>Speed {pokemonData.stats[[5]].base_stat}</li>
            </ul>
          </div>
        )}

        <h1 className="text-xl">Pokemon List</h1>
        <InfiniteScroll
          dataLength={pokemonList.length}
          next={handleNext}
          hasMore={true}
          loader={""}
          endMessage={<p>No more data to load.</p>}
        >
          <ul className="flex flex-wrap justify-center p-0 m-0">
            {pokemonList.map(pokemon => (
              <li
                key={pokemon.name}
                className="flex flex-col items-center justify-center rounded-lg m-2"
                onClick={() => setPokemonName(pokemon.name)}
              >
                <img
                  className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[[6]]}.png`}
                  alt={pokemon.name}
                />
                <label className="font-bold text-center">{pokemon.name}</label>
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      </div>
  );
}


export default App;