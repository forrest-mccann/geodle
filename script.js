const targetWords = [
  "earth",
  "night",
  "light",
  "creep",
  "solar",
  "crack",
  "lunar",
  "coral",
  "anion",
  "model",
  "trace",
  "scale",
  "venus",
  "sheet",
  "habit",
  "drift",
  "yield",
  "horst",
  "shear",
  "sleet",
  "zones",
  "event",
  "stage",
  "titan",
  "rover",
  "surge",
  "plant",
  "value",
  "trees",
  "roots",
  "steno",
  "decay",
  "folds",
  "domes",
  "plate",
  "cells",
  "lipid",
  "amino",
  "bound",
  "fungi",
  "cosmo",
  "stars",
  "soils",
  "radon",
  "humid",
  "state",
  "traps",
  "plume",
  "sigma",
  "error",
  "frost",
  "gauge",
  "comet",
  "skewt",
  "water",
  "pluto",
  "focus",
  "talus",
  "layer",
  "yowah",
  "amber",
  "cloud",
  "shell",
  "flora",
  "radio",
  "mafic",
  "stone",
  "atoll",
  "agate",
  "paleo",
  "smoke"
  "cycle",
  "varve",
  "quake",
  "drill",
  "crown",
  "geode",
  "pearl",
  "foram",
  "marsh",
  "tidal",
  "stock",
  "orbit",
  "ridge",
  "atmos",
  "algae",
  "delta",
  "plane",
  "topaz",
  "guyot",
  "ionic",
  "boron",
  "proto",
  "clast",
  "plain",
  "crust",
  "storm",
  "datum",
  "fluid",
  "dunes",
  "swave",
  "pwave",
  "waves",
  "fault",
  "glass",
  "ocean",
  "lahar",
  "joint",
  "karst",
  "level",
  "depth",
  "nappe",
  "trend",
  "chart",
  "argon",
  "polar",
  "shale",
  "butte",
  "basin",
  "flash",
  "curve",
  "noise",
  "genus",
  "taxon",
  "crest",
  "force",
  "hydro",
  "flood",
  "beryl",
  "skarn",
  "block",
  "chalk",
  "fjord",
  "slate",
  "chert",
  "levee",
  "radar",
  "sonar",
  "winds",
  "river",
  "curie", 
]
const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
// const offsetFromDate = new Date(2022, 0, 1)
// const msOffset = Date.now() - offsetFromDate
// const dayOffset = msOffset / 1000 / 60 / 60 / 24
// const targetWord = targetWords[Math.floor(dayOffset)]
const targetWord = "flora"

startInteraction()

function startInteraction() {
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick)
  document.removeEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key)
    return
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess()
    return
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey()
    return
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key)
    return
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= WORD_LENGTH) return
  const nextTile = guessGrid.querySelector(":not([data-letter])")
  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function deleteKey() {
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()]
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters")
    shakeTiles(activeTiles)
    return
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, "")

  if (!dictionary.includes(guess)) {
    showAlert("Not in word list")
    shakeTiles(activeTiles)
    return
  }

  stopInteraction()
  activeTiles.forEach((...params) => flipTile(...params, guess))
}

function flipTile(tile, index, array, guess) {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    "transitionend",
    () => {
      tile.classList.remove("flip")
      if (targetWord[index] === letter) {
        tile.dataset.state = "correct"
        key.classList.add("correct")
      } else if (targetWord.includes(letter)) {
        tile.dataset.state = "wrong-location"
        key.classList.add("wrong-location")
      } else {
        tile.dataset.state = "wrong"
        key.classList.add("wrong")
      }

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction()
            checkWinLose(guess, array)
          },
          { once: true }
        )
      }
    },
    { once: true }
  )
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]')
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div")
  alert.textContent = message
  alert.classList.add("alert")
  alertContainer.prepend(alert)
  if (duration == null) return

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () => {
      alert.remove()
    })
  }, duration)
}

function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake")
      },
      { once: true }
    )
  })
}

function checkWinLose(guess, tiles) {
  if (guess === targetWord) {
    showAlert("You Win", 5000)
    danceTiles(tiles)
    stopInteraction()
    return
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), null)
    stopInteraction()
  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance")
        },
        { once: true }
      )
    }, (index * DANCE_ANIMATION_DURATION) / 5)
  })
}
