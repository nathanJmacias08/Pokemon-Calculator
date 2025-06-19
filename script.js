let pokemonList = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchPokemonList();
  populateTypeChart();
  document.getElementById("mode-toggle").addEventListener("click", toggleDarkMode);
});

async function fetchPokemonList() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1010");
  const data = await res.json();
  pokemonList = data.results.map(p => p.name);
}

async function searchPokemon() {
  const name = document.getElementById("pokemon-search").value.toLowerCase().trim();
  if (!name) return;
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();
    displayPokemonData(data);
    playCry(data.id);
  } catch {
    document.getElementById("pokemon-data").innerHTML = "<p>Pokémon not found.</p>";
  }
}

function displayPokemonData(data) {
  const info = `
    <h2>${data.name.toUpperCase()}</h2>
    <img src="${data.sprites.front_default}" alt="${data.name}" />
    <p>Type: ${data.types.map(t => t.type.name).join(", ")}</p>
    <p>Abilities: ${data.abilities.map(a => a.ability.name).join(", ")}</p>
    <h3>Base Stats</h3>
    <ul>
      ${data.stats.map(s => `<li>${s.stat.name}: ${s.base_stat}</li>`).join("")}
    </ul>`;
  document.getElementById("pokemon-data").innerHTML = info;
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function playCry(id) {
  const audio = new Audio(`https://play.pokemonshowdown.com/audio/cries/${id}.mp3`);
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

function populateTypeChart() {
  const types = {
    fire: { strong: ["grass", "ice", "bug", "steel"], weak: ["water", "rock", "fire"] },
    water: { strong: ["fire", "rock", "ground"], weak: ["electric", "grass", "water"] },
    grass: { strong: ["water", "ground", "rock"], weak: ["fire", "bug", "poison"] },
    // Add more types as needed
  };
  const tbody = document.getElementById("type-chart-body");
  Object.keys(types).forEach(type => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${type}</td>
      <td>${types[type].strong.join(", ")}</td>
      <td>${types[type].weak.join(", ")}</td>`;
    tbody.appendChild(row);
  });
}