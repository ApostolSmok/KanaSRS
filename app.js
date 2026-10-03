import { hiraganaData, katakanaData } from './data.js';

// Переменные для состояния
let currentAlphabet = 'hiragana'; 
let kanaData = []; 
let currentCard = null;
let currentMode = 'manual';
const btnManual = document.getElementById("btn-manual");
const btnQuiz = document.getElementById("btn-quiz");
const manualContainer = document.getElementById("manual-container");
const quizContainer = document.getElementById("quiz-container");

// Находим новые кнопки
const quizButtons = document.querySelectorAll(".quiz-option");
const startScreen = document.getElementById("start-screen");
const studyScreen = document.getElementById("study-screen");
const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");
const btnHira = document.getElementById("btn-hira");
const btnKata = document.getElementById("btn-kata");
const charElement = document.getElementById("character");
const answerInput = document.getElementById("answer");
const checkBtn = document.getElementById("check-btn");
const feedbackElement = document.getElementById("feedback");

// Функция загрузки данных
function loadData() {
    // Используется динамический ключ
    const storageKey = 'kanaAppDB_' + currentAlphabet;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
        kanaData = JSON.parse(savedData);
    } else {
        // Если прогресса нет, берем оригинал из data.js
        // делаем глубокую копию, чтобы не менять исходный массив
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
    activeBtn.classList.add("active");
    inactiveBtn.classList.remove("active");
}

function switchMode(mode, activeBtn, inactiveBtn) {
    currentMode = mode;
    activeBtn.classList.add("active");
    inactiveBtn.classList.remove("active");
}

// Слушатели для кнопок
btnHira.addEventListener("click", () => switchAlphabet('hiragana', btnHira, btnKata));
btnKata.addEventListener("click", () => switchAlphabet('katakana', btnKata, btnHira));
btnManual.addEventListener("click", () => switchMode('manual', btnManual, btnQuiz));
btnQuiz.addEventListener("click", () => switchMode('quiz', btnQuiz, btnManual));

// Запуск при загрузке страницы (по умолчанию Хирагана)
btnHira.classList.add("active");

// 3. Отбираем карточки, время которых уже подошло
function getDueCards() {
    const now = Date.now();
    return kanaData.filter(card => card.next_review <= now);
}

// ОБНОВЛЕННАЯ ФУНКЦИЯ ПОКАЗА КАРТОЧКИ
function showNextCard() {
    const dueCards = getDueCards();
    
    if (dueCards.length === 0) {
        charElement.textContent = "";
        feedbackElement.textContent = "На сегодня всё! Отличная работа.";
        manualContainer.style.display = "none";
        quizContainer.style.display = "none";
        return;
    }

    currentCard = dueCards[Math.floor(Math.random() * dueCards.length)];
    charElement.textContent = currentCard.char;
    feedbackElement.textContent = "";

    if (currentMode === 'manual') {
        answerInput.value = "";
        answerInput.focus();
    } else {
        setupQuiz(); // Если режим Quiz, генерируем кнопки
    }
}

// ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ 4 ВАРИАНТОВ ОТВЕТА
function setupQuiz() {
    // 1. Создаем массив с правильным ответом
    let options = [currentCard.romaji];

    // Вычисляем максимальное количество кнопок 
    const maxOptions = Math.min(4, kanaData.length);

    // 2. Добавляем случайные неправильные ответы
    while (options.length < maxOptions) {
        let randomCard = kanaData[Math.floor(Math.random() * kanaData.length)];
        
        if (!options.includes(randomCard.romaji)) {
            options.push(randomCard.romaji);
        }
    }

    // 3. Перемешиваем массив, чтобы правильный ответ не был всегда первым
    options.sort(() => Math.random() - 0.5);

    // 4. Назначаем текст кнопкам и вешаем проверку ответа
    quizButtons.forEach((btn, index) => {
        if (index < maxOptions) {
            btn.style.display = "block"; // Показываем кнопку
            btn.textContent = options[index];
            
            btn.onclick = () => {
                if (btn.textContent === currentCard.romaji) {
                    handleCorrect();
                } else {
                    handleIncorrect();
                }
            };
        } else {
            btn.style.display = "none"; // Скрываем лишние кнопки, если символов меньше 4
        }
    });
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
// ПЕРЕХОД МЕЖДУ ОКНАМИ
startBtn.addEventListener("click", () => {
    // 1. Загружаем базу на основе выбранной азбуки
    loadData(); 
    
    // 2. Скрываем меню, показываем экран обучения
    startScreen.style.display = "none";
    studyScreen.style.display = "block";
    
    // 3. Показываем нужный блок ввода в зависимости от режима
    if (currentMode === 'manual') {
        manualContainer.style.display = "block";
        quizContainer.style.display = "none";
    } else {
        manualContainer.style.display = "none";
        quizContainer.style.display = "grid";
    }
    
    // 4. Показываем первую карточку
    showNextCard();
});

// Кнопка Назад
backBtn.addEventListener("click", () => {
    studyScreen.style.display = "none";
    startScreen.style.display = "block";
    feedbackElement.textContent = ""; // Очищаем текст ошибки/успеха
});

// ОБЩИЕ ФУНКЦИИ ДЛЯ ПРОВЕРКИ
function handleCorrect() {
    feedbackElement.textContent = "Правильно!";
    feedbackElement.style.color = "green";
    processAnswer(true);
    setTimeout(showNextCard, 1000);
}

function handleIncorrect() {
    feedbackElement.textContent = `Ошибка! Правильный ответ: ${currentCard.romaji}`;
    feedbackElement.style.color = "red";
    processAnswer(false);
    setTimeout(showNextCard, 2000);
}

// Проверка для ручного ввода
function checkManualAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    if (userAnswer === currentCard.romaji) {
        handleCorrect();
    } else {
        handleIncorrect();
    }
}

// Обновляем слушатели для ручного ввода
checkBtn.addEventListener("click", checkManualAnswer);
answerInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") checkManualAnswer();
});
