/*
This is your site JavaScript code - you can add interactivity and carry out processing
- Initially the JS writes a message to the console, and moves a button you can add from the README
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
//console.log("Hello 🌎");

/* 
Make the "Click me!" button move when the visitor clicks it:
- First add the button to the page by following the "Next steps" in the README
*/
/*
const btn = document.querySelector("button"); // Get the button from the page
// Detect clicks on the button
if (btn) {
  btn.onclick = function() {
    // The JS works in conjunction with the 'dipped' code in style.css
    btn.classList.toggle("dipped");
  };
}
*/

// global constants, 1000 milliseconds = 1s
const clueHoldTime = 200; //how long to hold each clue's light/sound
const cluePauseTime = 100; //how long to pause in between clues
const nextClueWaitTime = 400; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [randomIntFromInterval(1, 9),randomIntFromInterval(1, 9),randomIntFromInterval(1, 9),randomIntFromInterval(1, 9),randomIntFromInterval(1, 9),randomIntFromInterval(1, 9),randomIntFromInterval(1, 9),randomIntFromInterval(1, 9),randomIntFromInterval(1, 9),randomIntFromInterval(1, 9)]
//var pattern = [5,2,6,9,3,1,3,1,4,2,8,7,8];
var progress = 0; 
var gamePlaying = false;

var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;

var numOfMistake = 0;

function randomIntFromInterval(min, max) { 
  // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function startGame(){
  
    //initialize game variables
    progress = 0;
    gamePlaying = true;
    numOfMistake = 0;
  
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence();
}

function stopGame(){
  
    gamePlaying=false;
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");

}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter=0
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Oops, Game Over 🥺. U Lost 🤡.");
}

function winGame(){
  stopGame();
  alert("Congratulations 👏! U Win 🥳!");
}

function WrongFirst(){
  alert("Oops, u only have 2 strikes left");
}

function WrongSecond(){
  alert("Oops, u only have 1 strike left");
}

function guess(btn){
  
  console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    return;
  }
  
  //game logic
  if(pattern[guessCounter]==btn){
    //true
    if(guessCounter==progress){
      if(progress==pattern.length-1){
        winGame();
      }else{
        progress++;
        playClueSequence();
      }
    }else{
      guessCounter++;
    }
  }else{
    //false
    numOfMistake++;
    if(numOfMistake==1){
      WrongFirst();
      playClueSequence();
    }else if(numOfMistake==2){
      WrongSecond();
      playClueSequence();
    }else{
      loseGame();
    }
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.626,
  2: 349.228,
  3: 440.000,
  4: 523.251,
  5: 293.665,
  6: 391.995,
  7: 493.883,
  8: 311.127,
  9: 329.628
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

