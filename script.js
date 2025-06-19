async function getPokemonData(pokemonName) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  if (!response.ok) {
    document.getElementById("pokemon-data").innerHTML = "<p>Pokémon not found.</p>";
    return;
  }
  const data = await response.json();
  displayPokemonData(data);
}

function displayPokemonData(data) {
  const container = document.getElementById("pokemon-data");
  container.innerHTML = `
    <h2>${data.name.toUpperCase()}</h2>
    <img src="${data.sprites.front_default}" alt="${data.name}" />
    <p><strong>Type:</strong> ${data.types.map(type => type.type.name).join(", ")}</p>
    <p><strong>Stats:</strong></p>
    <ul>
      ${data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join("")}
    </ul>
    <p><strong>Abilities:</strong> ${data.abilities.map(ability => ability.ability.name).join(", ")}</p>
  `;
}

function searchPokemon() {
  const name = document.getElementById("pokemon-search").value.toLowerCase();
  if (name) getPokemonData(name);
}