const apiUrl = 'https://opentdb.com/api.php';

let currentQuestion = 0;
let score = 0;
let questions = [];
let category = '';

// Get user input for type and number of questions
const typeSelect = document.getElementById('type-select');
//const category = document.querySelector('#category-select').value;
const numQuestionsInput = document.getElementById('num-questions-input');

const categorySelect = document.getElementById('category-select');

  categorySelect.addEventListener('change', () => {
    category = categorySelect.value;
  });

// Update the score display
function updateScore() {
  document.getElementById("score").innerText = `Score: ${score} / ${questions.length}`;
}

// Fetch questions from API based on user input
function fetchQuestions() {
  const type = typeSelect.value;
  const numQuestions = numQuestionsInput.value;

  typeSelect.classList.add('hidden');
  categorySelect.classList.add('hidden');
  numQuestionsInput.classList.add('hidden');
  document.getElementById('start-button').classList.add('hidden');
  const url = `${apiUrl}?amount=${numQuestions}&type=${type}&category=${category}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      questions = data.results;
      displayQuestion();
    })
    .catch(error => console.error('Error fetching questions:', error));
}

function displayQuestion() {
  document.getElementById("question").innerHTML = questions[currentQuestion].question;
  const answers = document.getElementById("answers");
  answers.innerHTML = "";
  questions[currentQuestion].incorrect_answers.forEach((answer, index) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.innerHTML = answer;
    button.onclick = () => checkAnswer(index);
    li.appendChild(button);
    answers.appendChild(li);
  });
  const correctAnswer = questions[currentQuestion].correct_answer;
  const correctButton = document.createElement("button");
  correctButton.innerHTML = correctAnswer;
  correctButton.onclick = () => checkAnswer(questions[currentQuestion].incorrect_answers.length);
  answers.appendChild(correctButton);
  updateScore();
  document.getElementById("current-question-number").innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
}

function checkAnswer(answer) {
  if (answer === questions[currentQuestion].incorrect_answers.length) {
    score++;
    document.getElementById("result").innerHTML = "Correct!";
  } else {
    document.getElementById("result").innerHTML = `Incorrect. The correct answer was ${questions[currentQuestion].correct_answer}`;
  }
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    document.getElementById("result").innerHTML = `Game over! Your final score is ${score} out of ${questions.length}`;
    document.getElementById("next-question").style.display = "none";
    typeSelect.classList.remove('hidden');
    categorySelect.classList.remove('hidden');
    numQuestionsInput.classList.remove('hidden');
    startButton.classList.remove('hidden');
  } else {
    displayQuestion();
  }
}

// Add event listener to start button
document.getElementById("start-button").addEventListener("click", fetchQuestions);

// Add event listener to next question button
document.getElementById("next-question").addEventListener("click", displayQuestion);
