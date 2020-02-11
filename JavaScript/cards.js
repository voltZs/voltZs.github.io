var isScrolling;
var scrollDirection;
var readyForNext = true;
var lastWheelDelta;
var wheelCheckEnabled = false;
var wantToFlip = false;
var cardTimeOutControl = true;
var scrollBody = document.getElementById("fakeBody");

var initCardPos = document.getElementById("realBody").scrollHeight*1.2;
var masterDeck = document.getElementById("leftDeck");
var answerDeck = document.getElementById("rightDeck");
var currentCard = 0;
var indicatorHead = document.getElementById("head");

var masterArray = [
  "AAaaaaAA aAAAa",
  "BBbBBbbb BB b b b bBB",
  "CC C  c C CC  C C C",
  "D DdDDdddDD  D",
  "EEE eEEE e EE",
  "FF FffFF F",
  "GG GGGGGggg",
  "HHHH H Hhh h"
]

var answersArray = [
  ["Hello","World"],
  ["THis"],
  ["Is", "Zsolt"],
  [""],
  ["", ""],
  [""],
  ["", "", ""],
  ["", "", "", ""]
]


for(i=0; i < masterArray.length+1; i++){
  var indicator = document.createElement("div");
  indicator.classList.add("pageIndicator");
  indicatorHead.append(indicator);
}
updateCurrentIndicator();

function updateCurrentIndicator(){
  for(i = 0; i < indicatorHead.children.length; i++){
    if(currentCard == i){
      indicatorHead.children[i].classList.add("active");
    } else {
      indicatorHead.children[i].classList.remove("active");
    }
  }
}


function addToMaster(cardString){
  var card = createCard(cardString)
  card.classList.add("masterCard");
  var ratio = (Math.random()*2)-1;
  card.style.transform = "rotate("+ ratio*20 + "deg)";
  masterDeck.append(card);
  throwToTarget(card);
}

function removeFromMaster(){
  snatchFromTarget(masterDeck.lastChild);
}

function addToAnswers(answersArray){
  var arraySize = answersArray.length;
  for(i = 0; i < arraySize; i++ ){
    var modifier = i-((arraySize-1)/2);
    var card = createCard(answersArray[i]);
    card.classList.add("answerCard");
    card.style.left = modifier * 120 + "px";
    card.style.transform = "rotate("+ modifier*30 + "deg)";
    answerDeck.append(card);
    throwToTarget(card);
  }
}

function removeFromAnswers(numToRemove){
  console.log("to remove:" + numToRemove)
  for(i = 0; i < numToRemove; i++){
    // console.log(answerDeck.children[answerDeck.children.length-1-i]);
    snatchFromTarget(answerDeck.children[answerDeck.children.length-1-i]);
  }
}

function throwToTarget(cardElement) {
  var pos = parseInt(cardElement.style.top);
  var speed = pos/20;
  var interval = setInterval(function(){
    if (pos <= 0) {
      clearInterval(interval);
    } else {
      pos -= speed;
      cardElement.style.top = pos + 'px';
    }
  }, 10);
}

function snatchFromTarget(cardElement){
  var pos = parseInt(cardElement.style.top);
  var speed = 30;
  var interval = setInterval(function(){
    if (pos >= initCardPos) {
      clearInterval(interval);
      cardElement.remove();
    } else {
      pos += speed;
      cardElement.style.top = pos + 'px';
    }
  }, 10);
}

function createCard(cardString){
  var card = document.createElement("div");
  card.innerText = cardString
  card.classList.add("card");
  card.style.top = initCardPos + "px";
  return card
}


document.body.addEventListener("wheel", function(e){
  if (Math.abs(lastWheelDelta) >= Math.abs(e.wheelDeltaY) && wheelCheckEnabled){
    console.log("stopped scrolling!!!!!!")
    wheelCheckEnabled = false;
    wantToFlip = true;
  }
  if (Math.abs(lastWheelDelta) < Math.abs(e.wheelDeltaY) && readyForNext == true){
    console.log("Now Scrolling!!!!")
    wheelCheckEnabled = true;
    readyForNext = false;
  }

  lastWheelDelta = e.wheelDeltaY;

  if(wantToFlip && cardTimeOutControl){
    if(lastWheelDelta > 0){
      console.log("REMOVE CARD")
      if(currentCard > 0){
        removeFromMaster();
        removeFromAnswers(answersArray[currentCard-1].length);
        currentCard--;
      }
    } else {
      console.log("ADD CARD")
      if(currentCard < masterArray.length){
        addToMaster(masterArray[currentCard]);
        addToAnswers(answersArray[currentCard]);
        currentCard++;
      }
    }
    updateCurrentIndicator();
    wantToFlip = false;
    cardTimeOutControl = false;
    window.setTimeout(function(){
      cardTimeOutControl = true;
      readyForNext = true;
    }, 400);
  }
  window.scrollTo(0, document.body.scrollHeight/2);
})
