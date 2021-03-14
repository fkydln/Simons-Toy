// global constants

const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables;
var numberOfMistakes = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var pattern = [
  getRandomValue(1, 6),
  getRandomValue(1, 6),
  getRandomValue(1, 6),
  getRandomValue(1, 6),
  getRandomValue(1, 6)
];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var secToPrint = 40; // how many seconds of the game you allow

function disable() {
  //disable buttons, so user can't click while clue-play
  document.getElementById("button1").classList.add("disabled");
  document.getElementById("button2").classList.add("disabled");
  document.getElementById("button3").classList.add("disabled");
  document.getElementById("button4").classList.add("disabled");
  document.getElementById("button5").classList.add("disabled");
  document.getElementById("button6").classList.add("disabled");
}

//enable buttons, so user can click after clue-play is done.
function enable() {

  document.getElementById("button1").classList.remove("disabled");
  document.getElementById("button2").classList.remove("disabled");
  document.getElementById("button3").classList.remove("disabled");
  document.getElementById("button4").classList.remove("disabled");
  document.getElementById("button5").classList.remove("disabled");
  document.getElementById("button6").classList.remove("disabled");
}




function startGame() {
  //initiazlize game variables;
  numberOfMistakes = 3;
  progress = 0;
  gamePlaying = true;

  //swap the Start and Stop buttons:
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  playClueSequence();
  
  
  var timer = setInterval(() => {
    secToPrint = secToPrint -1;
    var displayTime = document.getElementById("timer").innerHTML = `Time: ` + secToPrint;
    
    if (secToPrint % 2 === 0 && secToPrint <= 20) {
      console.log("Kirmizi.");
      document.getElementById("timer").classList.remove("green" , "white");
      document.getElementById("timer").classList.add("red");
    }
    else if (secToPrint % 2 === 1 && secToPrint <= 20) {
      console.log("beyaz.");
      document.getElementById("timer").classList.remove("red", "green");
      document.getElementById("timer").classList.add("white");
  
    }
    else{
      document.getElementById("timer").classList.remove("red", "white");
      document.getElementById("timer").classList.add("green");
    }
    
    if (secToPrint === 0) {
      alert(
        "Time is over!"
      )
      stopTone();
      stopGame();
      secToPrint = 40;
      clearInterval(timer);
    }  
    if (gamePlaying === false) {
      clearInterval(timer);
    }
  }, 1000);

}

function stopGame() {
  clearInterval(timer);
  
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  
}

// Sound Synthesis Functions
const freqMap = {
  1: 240.6,
  2: 280.6,
  3: 320,
  4: 340.2,
  5: 400.1,
  6: 440.1
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;

}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
 

}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);

  }

}
function playClueSequence() {

  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
    clueHoldTime = clueHoldTime - 20;
  }
  
}
function loseGame() {
  stopGame();
  secToPrint = 41;
  
  alert("Game Over. You lost.");
}
function winGame() {
  stopGame();
  alert("Game Over. You WON.");
}
function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) { //if no game playing, it'll return out of this func.
    return  ;
  }

  //Game logic:

  if (pattern[guessCounter] == btn) {
    //guess is right!
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        //Game is over, you won!
        winGame();
      } else {
        //patten ok, next?
        progress++;
        playClueSequence();
      }
    } else {
      //check the next guess!
      guessCounter++;
    }
  } else if(numberOfMistakes === 1){
    //Wrong Guess, you're out!
    //Game over, you lost!
    loseGame();
  }
  else{
    //you lost a strike.
    numberOfMistakes--;
    alert(numberOfMistakes + " Strikes Left!");
    playClueSequence();
  }
}

function getRandomValue(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //max exclusive, min inclusive.
}

