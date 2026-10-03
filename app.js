import { hiraganaData, katakanaData } from './data.js';

// Переменные для состояния
let currentAlphabet = 'hiragana'; 
let kanaData = []; 
let currentCard = null;

// Находим новые кнопки
const btnHira = document.getElementById("btn-hira");
const btnKata = document.getElementById("btn-kata");
const charElement = document.getElementById("character");
const answerInput = document.getElementById("answer");
const checkBtn = document.getElementById("check-btn");
const feedbackElement = document.getElementById("feedback");

// Функция загрузки данных
function loadData() {
    // Используем динамический ключ, например: kanaAppDB_hiragana
    const storageKey = 'kanaAppDB_' + currentAlphabet;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
        kanaData = JSON.parse(savedData);
    } else {
        // Если прогресса нет, берем оригинал из data.js
        // ВАЖНО: делаем глубокую копию, чтобы не менять исходный массив
        const sourceData = currentAlphabet === 'hiragana' ? hiraganaData : katakanaData;
        kanaData = JSON.parse(JSON.stringify(sourceData)); 
    }
}

// Функция сохранения
function saveData() {
    const storageKey = 'kanaAppDB_' + currentAlphabet;
    localStorage.setItem(storageKey, JSON.stringify(kanaData));
}

// Функция переключения азбуки
function switchAlphabet(alphabet, activeBtn, inactiveBtn) {
    currentAlphabet = alphabet;
    
    // Меняем визуальный стиль кнопок
    activeBtn.classList.add("active");
    inactiveBtn.classList.remove("active");
    
    // Загружаем нужную базу, очищаем интерфейс и показываем карточку
    loadData();
    answerInput.style.display = "inline-block";
    checkBtn.style.display = "inline-block";
    showNextCard();
}

// Слушатели для кнопок
btnHira.addEventListener("click", () => switchAlphabet('hiragana', btnHira, btnKata));
btnKata.addEventListener("click", () => switchAlphabet('katakana', btnKata, btnHira));

// Запуск при загрузке страницы (по умолчанию Хирагана)
btnHira.classList.add("active");
loadData();
showNextCard();

// 3. Отбираем карточки, время которых уже подошло
function getDueCards() {
    const now = Date.now();
    return kanaData.filter(card => card.next_review <= now);
}

function showNextCard() {
    const dueCards = getDueCards();
    
    // Если на сегодня карточек больше нет
    if (dueCards.length === 0) {
        charElement.textContent = "";
        feedbackElement.textContent = "На сегодня всё! Выученные карточки появятся позже.";
        answerInput.style.display = "none";
        checkBtn.style.display = "none";
        return;
    }

    // Берем случайную карточку из тех, что ждут повторения
    currentCard = dueCards[Math.floor(Math.random() * dueCards.length)];
    
    charElement.textContent = currentCard.char;
    answerInput.value = "";
    feedbackElement.textContent = "";
    answerInput.focus();
}

// 4. Математика интервалов 
function processAnswer(isCorrect) {
    if (isCorrect) {
        // Увеличиваем интервал в зависимости от истории
        if (currentCard.reps === 0) currentCard.interval = 1;
        else if (currentCard.reps === 1) currentCard.interval = 6;
        else currentCard.interval = Math.round(currentCard.interval * currentCard.ease);
        
        currentCard.reps += 1;
    } else {
        // Сбрасываем прогресс при ошибке
        currentCard.reps = 0;
        currentCard.interval = 1;
        currentCard.ease = Math.max(1.3, currentCard.ease - 0.15); // Сложность падает, но не ниже 1.3
    }

    // Высчитываем будущую дату показа (текущее время + дни в миллисекундах)
    // Для тестирования сейчас интервал считается в МИНУТАХ. 
    // Замени "60 * 1000" на "24 * 60 * 60 * 1000", когда захочешь реальные дни.
    const INTERVAL_IN_MS = 10 * 1000; 
    currentCard.next_review = Date.now() + (currentCard.interval * INTERVAL_IN_MS);
    
    saveData(); // Сохраняем обновленные данные в браузер
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();

    if (userAnswer === currentCard.romaji) {
        feedbackElement.textContent = "Правильно!";
        feedbackElement.style.color = "green";
        processAnswer(true);
        setTimeout(showNextCard, 1000);
    } else {
        feedbackElement.textContent = `Ошибка! Правильный ответ: ${currentCard.romaji}.`;
        feedbackElement.style.color = "red";
        processAnswer(false);
        setTimeout(showNextCard, 2000);
    }
}

checkBtn.addEventListener("click", checkAnswer);
answerInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") checkAnswer();
});

showNextCard();