let pokemonList = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchPokemonList();
  document.getElementById("pokemon-search").addEventListener("input", handleAutocomplete);
});

async function fetchPokemonList() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1010");
  const data = await res.json();
  pokemonList = data.results.map(p => p.name);
}

function handleAutocomplete() {
  const input = document.getElementById("pokemon-search");
  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML = "";

  const value = input.value.toLowerCase();
  if (!value) return;

  const matches = pokemonList.filter(name => name.includes(value)).slice(0, 5);
  matches.forEach(match => {
    const option = document.createElement("div");
    option.textContent = match;
    option.className = "suggestion";
    option.onclick = () => {
      input.value = match;
      suggestions.innerHTML = "";
      searchPokemon();
    };
    suggestions.appendChild(option);
  });
}

async function getPokemonData(pokemonName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!response.ok) throw new Error("Pokémon not found");
    const data = await response.json();
    displayPokemonData(data);
    playCry(data.id);
  } catch (error) {
    document.getElementById("pokemon-data").innerHTML = "<p>Pokémon not found. Please check the name.</p>";
  }
}

function displayPokemonData(data) {
  const container = document.getElementById("pokemon-data");
  container.innerHTML = `
    <div class="poke-card animate">
      <h2>${data.name.toUpperCase()}</h2>
      <img src="${data.sprites.versions['generation-v']['black-white'].animated.front_default ||
                 data.sprites.front_default}" alt="${data.name}" />
      <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
      <p><strong>Abilities:</strong> ${data.abilities.map(a => a.ability.name).join(", ")}</p>
      <h3>Base Stats</h3>
      <ul>
        ${data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join("")}
      </ul>
    </div>
  `;
}

function searchPokemon() {
  const name = document.getElementById("pokemon-search").value.trim().toLowerCase();
  if (name) getPokemonData(name);
}

function playCry(id) {
  const audio = new Audio(`https://play.pokemonshowdown.com/audio/cries/${id}.mp3`);
  audio.volume = 0.6;
  audio.play().catch(() => {});
}