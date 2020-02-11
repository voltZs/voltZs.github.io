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

var masterCards = []
var answerCards = []

var maxScroll = scrollBody.scrollHeight-realBody.scrollHeight;
var checkPointSize = maxScroll/(masterArray.length+1);
var prevBreakPoint
var nextBreakPoint


for(i=0; i < masterArray.length+1; i++){
  var indicator = document.createElement("div");
  indicator.classList.add("pageIndicator");
  indicatorHead.append(indicator);
  let ind = i;
  indicator.addEventListener("click", function(){
    console.log(ind);
    window.scrollTo(0, (checkPointSize*(ind+1)));
  })
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
for(i=0; i < masterArray.length; i++){
  createMaster(masterArray[i]);
  createAnswers(answersArray[i]);
}


function createMaster(cardString){
  var card = createCard(cardString)
  card.classList.add("masterCard");
  var ratio = (Math.random()*2)-1;
  card.style.transform = "rotate("+ ratio*20 + "deg)";
  masterDeck.append(card);
  masterCards.push(card);
}

function addToMaster(cardIndex){
  throwToTarget(masterCards[cardIndex]);
}

function removeFromMaster(cardIndex){
  snatchFromTarget(masterCards[cardIndex]);
}

function createAnswers(answersArray){
  var arraySize = answersArray.length;
  var temp = [];
  for(ind = 0; ind < arraySize; ind++ ){
    var modifier = ind-((arraySize-1)/2);
    var card = createCard(answersArray[ind]);
    card.classList.add("answerCard");
    card.style.left = modifier * 120 + "px";
    card.style.transform = "rotate("+ modifier*30 + "deg)";
    answerDeck.append(card);
    temp.push(card);
  }
  answerCards.push(temp);
}

function addToAnswers(cardIndex){
  for(i = 0; i < answerCards[cardIndex].length; i++ ){
    throwToTarget(answerCards[cardIndex][i]);
  }
}

function removeFromAnswers(cardIndex){
  for(i = 0; i < answerCards[cardIndex].length; i++){
    snatchFromTarget(answerCards[cardIndex][i]);
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

window.addEventListener("scroll", function(){
  console.log(maxScroll);
  console.log(window.scrollY);
  updateDecks();
})

function updateDecks(){
  nextBreakPoint = checkPointSize*(currentCard+1);
  prevBreakPoint = checkPointSize*(currentCard);
  var scrollPos = window.scrollY;
  if(scrollPos > nextBreakPoint && currentCard < masterArray.length){
    console.log("Adding cards");
    addToMaster(currentCard);
    addToAnswers(currentCard);
    currentCard++;
    console.log("Changing current card to: " + currentCard);
    updateDecks();
  }
  if(scrollPos < prevBreakPoint && currentCard > 0){
    console.log("removing cards");
    removeFromMaster(currentCard-1);
    removeFromAnswers(currentCard-1);
    currentCard--;
    console.log("Changing current card to: " + currentCard);
    updateDecks();
  }
  updateCurrentIndicator();

}
