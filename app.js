// 1. База карточек (пока без интервалов, только 5 символов для теста)
const kanaData = [
    { id: "hira_a", char: "あ", romaji: "a" },
    { id: "hira_i", char: "い", romaji: "i" },
    { id: "hira_u", char: "う", romaji: "u" },
    { id: "hira_e", char: "え", romaji: "e" },
    { id: "hira_o", char: "お", romaji: "o" }
];

let currentCard = null;

// 2. Находим элементы на странице
const charElement = document.getElementById("character");
const answerInput = document.getElementById("answer");
const checkBtn = document.getElementById("check-btn");
const feedbackElement = document.getElementById("feedback");

// 3. Функция показа случайной карточки
function showNextCard() {
    const randomIndex = Math.floor(Math.random() * kanaData.length);
    currentCard = kanaData[randomIndex];

    charElement.textContent = currentCard.char;
    answerInput.value = ""; // Очищаем поле
    feedbackElement.textContent = "";
    answerInput.focus();
}

// 4. Функция проверки ответа
function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();

    if (userAnswer === currentCard.romaji) {
        feedbackElement.textContent = "Правильно! 🎉";
        feedbackElement.style.color = "green";
        setTimeout(showNextCard, 1000); // Показываем новую карточку через 1 секунду
    } else {
        feedbackElement.textContent = `Ошибка! Правильный ответ: ${currentCard.romaji}`;
        feedbackElement.style.color = "red";
    }
}

// 5. Вешаем слушатели событий на кнопку и клавишу Enter
checkBtn.addEventListener("click", checkAnswer);
answerInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

// 6. Запускаем при открытии страницы
showNextCard();
