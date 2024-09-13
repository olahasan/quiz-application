//////////////////////screens before test//////////////////////
/////first screen/////

// global variables:
let SelectedCategory, SelectedNumOfQuestions, SelectedDifficultyLevel;

document.addEventListener("click", function (e) {
  if (e.target.name === "quiz-category") {
    SelectedCategory = e.target.value;
  } else if (e.target.name === "number-question") {
    SelectedNumOfQuestions = e.target.value;
  } else if (e.target.name === "Difficulty-level") {
    SelectedDifficultyLevel = e.target.value;
  }
});

let readyButton = document.querySelector(".ready");
let errorMessage = document.querySelector(".error-message");
let firstScreen = document.querySelector(".first-screen");
let secondScreen = document.querySelector(".second-screen");

readyButton.onclick = function () {
  console.log(SelectedCategory);
  console.log(SelectedNumOfQuestions);
  console.log(SelectedDifficultyLevel);

  if (SelectedCategory && SelectedNumOfQuestions && SelectedDifficultyLevel) {
    errorMessage.style.display = "none";
    firstScreen.style.transform = "translateX(1200px)";
    setTimeout(function () {
      firstScreen.remove();
    }, 500);
    document.querySelector(".num").textContent = SelectedNumOfQuestions;
    document.querySelector(".difficult").textContent = SelectedDifficultyLevel;
    document.querySelector(".lang").textContent = SelectedCategory;
  } else {
    errorMessage.style.display = "block";
  }
};

/////second screen/////
let startButton = document.querySelector(".start");
startButton.onclick = function () {
  secondScreen.style.transform = "translateX(-1200px)";
  theThirdScreen();
};

/////third screen/////
let video = document.querySelector(".video-background");
let audio = document.querySelector(".roctAudio");
let thirdScreen = document.querySelector(".third-screen");
let quizApp = document.querySelector(".quiz-app");
function theThirdScreen() {
  video.play();
  audio.play();
  setTimeout(function () {
    thirdScreen.style.transform = "translateY(-1200px)";
  }, 1000);
  setTimeout(function () {
    video.pause();
    audio.pause();
  }, 2000);
  setTimeout(function () {
    quizApp.style.transform = "translateY(0)";
    getQuestions();
  }, 2010);
  setInfoTest();
}

let choseenLang = document.querySelector(".choseenLang");
let choseenNum = document.querySelector(".choseenNum");
let choseenLevel = document.querySelector(".choseenLevel");
console.log(choseenLang);
console.log(choseenNum);
console.log(choseenLevel);
function setInfoTest() {
  choseenLang.innerHTML = SelectedCategory;
  choseenNum.innerHTML = SelectedNumOfQuestions;
  choseenLevel.innerHTML = SelectedDifficultyLevel;
}

//////////////////////after test//////////////////////
// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
let questionsObject;
let qCount;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      questionsObject = JSON.parse(this.responseText);
      questionsObject = questionsObject = shuffleArray(questionsObject).slice(
        0,
        SelectedNumOfQuestions
      );
      qCount = getNumberOfQuestion();
      // Create Bullets + Set Questions Count
      createBullets();

      // Add Question Data
      addQuestionData(questionsObject[currentIndex]);

      // Start CountDown
      countdown(30);

      handleSubmit();
    }
  };
  myRequest.open("GET", getFileName(), true);
  myRequest.send();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getNumberOfQuestion() {
  switch (SelectedNumOfQuestions) {
    case "4":
      return 4;
    case "6":
      return 6;
    case "10":
      return 10;
  }
}

function getFileName() {
  switch (SelectedCategory) {
    case "html":
      switch (SelectedDifficultyLevel) {
        case "easy":
          return "html_easy.json";
        case "Intermediate ":
          return "html_Intermediate.json";
        case "hard":
          return "html_hard.json";
      }
    case "css":
      switch (SelectedDifficultyLevel) {
        case "easy":
          return "css_easy.json";
        case "Intermediate ":
          return "css_Intermediate.json";
        case "hard":
          return "css_hard.json";
      }
    case "js":
      switch (SelectedDifficultyLevel) {
        case "easy":
          return "js_easy.json";
        case "Intermediate ":
          return "js_Intermediate.json";
        case "hard":
          return "js_hard.json";
      }
    default:
    // return "html_questions.json";
  }
}

let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
function createBullets() {
  countSpan.innerHTML = qCount;

  // Create Spans
  for (let i = 0; i < qCount; i++) {
    // Create Bullet = 9 span
    let spanElement = document.createElement("span");

    // Check If Its First Span
    if (i === 0) {
      spanElement.className = "on";
    }

    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(spanElement);
  }
}

function addQuestionData(obj) {
  if (currentIndex < qCount) {
    //add Question
    createQuestions(obj);

    //add Answers
    createAnswers(obj);
  }
}
function createQuestions(obj) {
  let questionTitle = document.createElement("h2");
  let questionText = document.createTextNode(obj.title);
  questionTitle.appendChild(questionText);
  quizArea.appendChild(questionTitle);
}

let answersArea = document.querySelector(".answers-area");
let quizArea = document.querySelector(".quiz-area");
function createAnswers(obj) {
  for (let i = 1; i <= 4; i++) {
    //container
    let mainDiv = document.createElement("div");
    mainDiv.className = "answer";

    //input
    let radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.id = `answer_${i}`;
    radioInput.name = "questions";
    radioInput.dataset.answer = obj[`answer_${i}`];

    if (i === 1) {
      radioInput.checked = true;
    }

    //label for input
    let theLabel = document.createElement("label");
    theLabel.htmlFor = radioInput.id;
    let theLabelText = document.createTextNode(radioInput.dataset.answer);
    theLabel.appendChild(theLabelText);

    //append
    mainDiv.appendChild(radioInput);
    mainDiv.appendChild(theLabel);

    answersArea.appendChild(mainDiv);
  }
}

let popAudio = document.querySelector(".pop-audio");
function handleSubmit() {
  let submitButton = document.querySelector(".submit-button");
  submitButton.onclick = function () {
    popAudio.play();
    let theRightAnswer = questionsObject[currentIndex].right_answer;

    currentIndex++;

    if (checkAnswer(theRightAnswer, getChoosenAnswer())) {
      rightAnswers++;
    }

    // Remove Previous Question & Answer
    removePrevQueAnswer();

    //add new Question
    addQuestionData(questionsObject[currentIndex], qCount);

    handleBullets();

    // Start CountDown
    clearInterval(countdownInterval);
    countdown(30);

    // Show Results
    showResults();
    playAgain();
  };
}

let answers = document.getElementsByName("questions");
function getChoosenAnswer() {
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  return theChoosenAnswer;
}

function checkAnswer(theRightAnswer, theChoosenAnswer) {
  if (theChoosenAnswer === theRightAnswer) {
    return true;
  }
  console.log(theChoosenAnswer);
  console.log(theRightAnswer);
}

function removePrevQueAnswer() {
  quizArea.innerHTML = "";
  answersArea.innerHTML = "";
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);

  arrayOfSpans.forEach((span, index) => {
    if (index === currentIndex) {
      span.classList.add("on");
    }
  });
}

let resultsContainer = document.querySelector(".results");
function showResults() {
  if (currentIndex === qCount) {
    clearScreen();

    if (rightAnswers > qCount / 2 && rightAnswers < qCount) {
      createFinalScreen(
        "Keep Going,YOU CAN DO IT, practice makes perfect",
        "Do you want to take the Test again?",
        "good",
        "YES",
        "NO"
      );
    } else if (rightAnswers === qCount) {
      createFinalScreen(
        "perfect, Keep Going",
        "Do you want to take the Test again?",
        "perfect",
        "YES",
        "NO"
      );
    } else {
      createFinalScreen(
        "Keep Going, YOU CAN DO IT, practice makes perfect",
        "Do you want to take the Test again?",
        "bad",
        "YES",
        "NO"
      );
    }

    resultsContainer.classList.remove("none");
  }
}

let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
function clearScreen() {
  quizArea.remove();
  answersArea.remove();
  submitButton.remove();
  bullets.remove();
}

function createFinalScreen(title, question, Resclass, btnYes, btnNo) {
  //whole result
  let theRes = document.createElement("span");
  theRes.className = Resclass;
  let theResText = document.createTextNode(`${rightAnswers} of ${qCount}`);
  theRes.appendChild(theResText);
  resultsContainer.appendChild(theRes);

  //title
  let theTitle = document.createElement("div");
  theTitle.className = Resclass;
  let theTitleText = document.createTextNode(title);
  theTitle.appendChild(theTitleText);

  //append the title into the resultsContainer
  resultsContainer.appendChild(theTitle);

  //paagraph
  let theParagraph = document.createElement("p");
  theParagraph.className = "question";
  let theParagraphText = document.createTextNode(question);
  theParagraph.appendChild(theParagraphText);

  //append the Paragraph into the resultsContainer
  resultsContainer.appendChild(theParagraph);

  //btns container
  let theBtnContainer = document.createElement("div");
  theBtnContainer.className = "btn-container";

  //yes button function
  let theBtnYes = createButton(btnYes, "btn-yes");

  //no button function
  let theBtnNo = createButton(btnNo, "btn-no");

  // append Btns Into thier Container function
  appendBtnsInContainer([theBtnYes, theBtnNo], theBtnContainer);

  resultsContainer.appendChild(theBtnContainer);
}

function createButton(text, className) {
  let btn = document.createElement("button");
  btn.className = className;
  let btnText = document.createTextNode(text);
  btn.appendChild(btnText);

  return btn;
}

function appendBtnsInContainer(buttons, theBtnContainer) {
  buttons.forEach((button) => {
    theBtnContainer.appendChild(button);
    theBtnContainer.appendChild(button);
  });
}

function playAgain() {
  addEventListeners();
}

function addEventListeners() {
  document.onclick = addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-yes")) {
      handleYes();
    }

    if (e.target.classList.contains("btn-no")) {
      handleNo();
    }
  });
}

function handleYes() {
  location.reload();
}

function handleNo() {
  resultsContainer.innerHTML = "";

  let p = document.createElement("p");
  p.className = "thanks";
  let pText = document.createTextNode("THANK YOU");
  p.appendChild(pText);

  resultsContainer.appendChild(p);
  document.querySelector(".quiz-info").style.display = "none";
  resultsContainer.style.marginTop = "0";
  quizApp.style.transform = "translateY(60px)";
}

let countdownElement = document.querySelector(".countdown");
function countdown(duration) {
  if (currentIndex < qCount) {
    let minutes, seconds;

    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
