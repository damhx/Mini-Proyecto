const listaPokemon = document.querySelector("#listaPokemon")
const botonesHeader = document.querySelectorAll(".btn-header")
const URL = "https://pokeapi.co/api/v2/pokemon/"
const pokemonData = [] 

const cargarFavoritos = () => {
  return JSON.parse(localStorage.getItem("pokemonFavoritos")) || []
}

const guardarFavoritos = (favoritos) => {
  localStorage.setItem("pokemonFavoritos", JSON.stringify(favoritos))
}

const esFavorito = (id) => {
  const favoritos = cargarFavoritos()
  return favoritos.includes(id)
}

const toggleFavorito = (id) => {
  const favoritos = cargarFavoritos()
  const index = favoritos.indexOf(id)

  if (index === -1) {
    favoritos.push(id)
  } else {
    favoritos.splice(index, 1)
  }

  guardarFavoritos(favoritos)
  return index === -1
}

for (let i = 1; i <= 151; i++) {
  fetch(`${URL}${i}`)
    .then((response) => response.json())
    .then((data) => {
      pokemonData.push(data)
      mostrarPokemon(data)
    })
}

function mostrarPokemon(poke) {
  let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`)
  tipos = tipos.join("")

  let pokeId = poke.id.toString()
  if (pokeId.length === 1) {
    pokeId = "00" + pokeId
  } else if (pokeId.length === 2) {
    pokeId = "0" + pokeId
  }

  const favorito = esFavorito(poke.id)
  const estrella = favorito ? "★" : "☆"
  const claseEstrella = favorito ? "favorito" : ""

  const div = document.createElement("div")
  div.classList.add("pokemon")
  div.setAttribute("data-id", poke.id)
  div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen-container">
            <div class="pokemon-imagen">
                <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
            </div>
            <button class="btn-favorito ${claseEstrella}" data-id="${poke.id}">${estrella}</button>
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `
  listaPokemon.append(div)

  const btnFavorito = div.querySelector(".btn-favorito")
  btnFavorito.addEventListener("click", (e) => {
    e.stopPropagation()
    const id = Number.parseInt(btnFavorito.getAttribute("data-id"))
    const esAhora = toggleFavorito(id)

    if (esAhora) {
      btnFavorito.textContent = "★"
      btnFavorito.classList.add("favorito")
    } else {
      btnFavorito.textContent = "☆"
      btnFavorito.classList.remove("favorito")
    }

    const botonActivo = document.querySelector(".btn-header.active")
    if (botonActivo && botonActivo.id === "favoritos" && !esAhora) {
      div.remove()
    }
  })
}

function mostrarFavoritos() {
  const favoritos = cargarFavoritos()
  listaPokemon.innerHTML = ""

  if (favoritos.length === 0) {
    const mensaje = document.createElement("div")
    mensaje.classList.add("mensaje-favoritos")
    mensaje.textContent = "No tienes Pokémon favoritos guardados"
    listaPokemon.appendChild(mensaje)
    return
  }

  pokemonData.filter((pokemon) => favoritos.includes(pokemon.id)).forEach((pokemon) => mostrarPokemon(pokemon))
}

botonesHeader.forEach((boton) =>
  boton.addEventListener("click", (event) => {
    botonesHeader.forEach((b) => b.classList.remove("active"))
    event.currentTarget.classList.add("active")

    const botonId = event.currentTarget.id

    if (botonId === "favoritos") {
      mostrarFavoritos()
      return
    }

    listaPokemon.innerHTML = ""

    if (botonId === "ver-todos") {
      pokemonData.forEach((data) => mostrarPokemon(data))
    } else {
      pokemonData.forEach((data) => {
        const tipos = data.types.map((type) => type.type.name)
        if (tipos.some((tipo) => tipo.includes(botonId))) {
          mostrarPokemon(data)
        }
      })
    }
  }),
)