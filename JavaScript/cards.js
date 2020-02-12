var isScrolling;
var scrollDirection;
var readyForNext = true;
var lastWheelDelta;
var wheelCheckEnabled = false;
var wantToFlip = false;
var cardTimeOutControl = true;
var scrollBody = document.getElementById("fakeBody");

var initCardPos = window.innerHeight;
var masterDeck = document.getElementById("leftDeck");
var answerDeck = document.getElementById("rightDeck");
var currentCard = 0;
var indicatorHead = document.getElementById("head");

var masterArray = [
  "I'm a ____________ currently living in ____________ .",
  "I enjoy  ____________ that require both ____________ and ____________ skills.",
  "With a good track for ____________ I'm finishing my ____________ soon .",
  "And what I'd love is to ____________ .",
  "I've had loads of fun developing ____________ , ____________ , and ____________ .",
  "But also did my bit in technical projects like ____________ and ____________ .",
  "I'll be delighted if you have a look at my ____________ below or ____________ ."
]

var answersArray = [
  ["Nerd.", "Edinburgh."],
  ["Solving problems.", "Creative.", "Technical."],
  ["A first-class degree.", "Bachelor in Computing."],
  ["Start the career I've been growing my skillset for the past 5 years."],
  ["Pokédex.", "Say the Same Thing.", "Vent."],
  ["Tic-Cat-Toe.", "Improvisor."],
  ["CV / socials.", "Drop me an e-mail."]
]

var answersLinks = [
  [],
  [],
  [],
  [],
  ["https://github.com/voltZs/varga_zsolt_set09103_cw1", "https://github.com/voltZs/varga_zsolt_set09103_cw2", "https://github.com/voltZs/varga_zsolt_set08101_coursework2"],
  ["https://github.com/voltZs/varga_zsolt_ads", "https://github.com/voltZs/improvisor-group-project"],
  []
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
  createDecks(i);
}

function addToMaster(cardIndex){
  throwToTarget(masterCards[cardIndex]);
}

function removeFromMaster(cardIndex){
  snatchFromTarget(masterCards[cardIndex]);
}

function createDecks(i){
  var arraySize = answersArray[i].length;
  var linksSize = answersLinks[i].length;

  var mCard = createCard(masterArray[i])
  mCard.classList.add("masterCard");
  if(linksSize > 0){
    var noteDiv = document.createElement("div");
    noteDiv.innerText = "*Gold cards are clickable!";
    mCard.append(noteDiv);
  }
  var ratio = (Math.random()*2)-1;
  mCard.style.transform = "rotate("+ ratio*20 + "deg)";
  masterDeck.append(mCard);
  masterCards.push(mCard);

  var temp = [];
  for(ind = 0; ind < arraySize; ind++ ){
    var modifier = ind-((arraySize-1)/2);
    var aCard = createCard(answersArray[i][ind]);
    aCard.classList.add("answerCard");
    aCard.style.left = modifier * 120 + "px";
    aCard.style.transform = "rotate("+ modifier*(50/arraySize) + "deg)";
    if(linksSize >0){
      if(!(answersLinks[i][ind] === "")){
        aCard.classList.add("linkCard");
        var tag = document.createElement("a");
        tag.href = answersLinks[i][ind];
        tag.append(aCard);
        answerDeck.append(tag);
      } else {
        answerDeck.append(aCard);
      }
    } else {
      answerDeck.append(aCard);
    }

    temp.push(aCard);
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
  card.innerHTML = "<div>" + cardString + "</div>";
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
  if(scrollPos <= prevBreakPoint && currentCard > 0){
    console.log("removing cards");
    removeFromMaster(currentCard-1);
    removeFromAnswers(currentCard-1);
    currentCard--;
    console.log("Changing current card to: " + currentCard);
    updateDecks();
  }
  updateCurrentIndicator();

}
