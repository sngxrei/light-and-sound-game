// global constants
const clueHoldTime = 1000; // light and sound duration
const cluePauseTime = 333; // duration between each clue
const nextClueWaitTime = 1000; // duration between each level

// global variables
var pattern = [1, 2, 3, 1, 2, 4, 3, 2, 1];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; // must be between 0.0 and 1.0 
var guessCounter = 0;


// start and stop game functions
function startGame() {
  // initialize game variables
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden"); // swap start and stop buttons
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}
function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden"); // swap start and stop buttons
  document.getElementById("stopBtn").classList.add("hidden");
}


// sound synthesis functions
const freqMap = {
  1: 311.1,
  2: 369.9,
  3: 415.3,
  4: 440.0
}
function playTone(btn,len) {
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
  tonePlaying = true
  setTimeout(function() {
    stopTone()
  },len)
}
function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
    tonePlaying = true
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025)
  tonePlaying = false
}


// page initialization; init sound synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)


function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit")
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit")
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0; // reset to 0
  let delay = nextClueWaitTime; // sets delay to initial wait time
  for (let i = 0; i <= progress; i++) { // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue, delay, pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
  alert("Game over! You lost :(");
}

function winGame() {
  stopGame();
  alert("Game over. You won! :)")
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) { // pressed start?
    return;
  }
  
  // add game logic here
  if (btn == pattern[guessCounter]) { // correct :)
    if (guessCounter >= progress) { // correct, turn is over
      if (progress == pattern.size - 1) { // correct, last turn
        winGame();
        return;
      }
      else { // correct, not last turn
        progress++;
        playClueSequence();
      }
    }
    else // correct, turn not over
      guessCounter++;
  }
  
  else { // incorrect :(
    loseGame();
    return;
  }
}