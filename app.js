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
const btnLearn = document.getElementById("btn-learn");
const learningContainer = document.getElementById("learning-container");
const flashcard = document.getElementById("flashcard");
const learnChar = document.getElementById("learn-char");
const learnRomaji = document.getElementById("learn-romaji");
const learningButtons = document.getElementById("learning-buttons");
const btnLearnWrong = document.getElementById("btn-learn-wrong");
const btnLearnCorrect = document.getElementById("btn-learn-correct");
const btnKanji = document.getElementById("btn-kanji");
const kanjiCreator = document.getElementById("kanji-creator");
const newKanjiChar = document.getElementById("new-kanji-char");
const newKanjiMeaning = document.getElementById("new-kanji-meaning");
const btnAddKanji = document.getElementById("btn-add-kanji");
const kanjiFeedback = document.getElementById("kanji-feedback");

// --- СЛОВАРЬ ПЕРЕВОДОВ ---
const translations = {
    ru: {
        title: "Настройки обучения",
        alphabetText: "Выберите азбуку:",
        hiraBtn: "Хирагана",
        kataBtn: "Катакана",
        modeText: "Выберите режим:",
        manualBtn: "✍️ Ввод текста",
        quizBtn: "🎯 Тест",
        startBtn: "Начать!",
        backBtn: "⬅ В меню",
        placeholder: "Введите ромадзи",
        checkBtn: "Проверить",
        feedbackDone: "На сегодня всё! Отличная работа.",
        feedbackCorrect: "Правильно!",
        feedbackError: "Ошибка! Правильный ответ: ",
        learnBtn: "🃏 Карточки",
        flipHint: "Нажми, чтобы перевернуть",
        btnRemember: "✔ Помню",
        btnForget: "✖ Не помню",

        kanjiBtn: "Кандзи",
        kanjiTitle: "Создать свою карточку:",
        kanjiCharPlace: "Иероглиф (напр. 水)",
        kanjiMeanPlace: "Чтение/перевод (напр. mizu - вода)",
        kanjiAddBtn: "➕ Добавить в колоду",
        kanjiAdded: "Добавлено: "
    },
    en: {
        title: "Study Settings",
        alphabetText: "Select alphabet:",
        hiraBtn: "Hiragana",
        kataBtn: "Katakana",
        modeText: "Select mode:",
        manualBtn: "✍️ Text Input",
        quizBtn: "🎯 Quiz",
        startBtn: "Start!",
        backBtn: "⬅ Back to Menu",
        placeholder: "Enter romaji",
        checkBtn: "Check",
        feedbackDone: "That's all for today! Great job.",
        feedbackCorrect: "Correct!",
        feedbackError: "Wrong! Correct answer: ",
        learnBtn: "🃏 Flashcards",
        flipHint: "Tap to flip",
        btnRemember: "✔ I remember",
        btnForget: "✖ I forgot",

        kanjiBtn: "Kanji",
        kanjiTitle: "Create custom card:",
        kanjiCharPlace: "Kanji (e.g. 水)",
        kanjiMeanPlace: "Reading/Meaning (e.g. mizu - water)",
        kanjiAddBtn: "➕ Add to deck",
        kanjiAdded: "Added: "
    }
};

// Язык по умолчанию (проверяем, сохранял ли пользователь ранее)
let currentLang = localStorage.getItem('kanaLang') || 'en';

// Кнопки языка
const btnLangRu = document.getElementById("lang-ru");
const btnLangEn = document.getElementById("lang-en");

function applyLanguage() {
    const t = translations[currentLang];
    
    // Обновляем текст в HTML
    document.getElementById("ui-title").textContent = t.title;
    document.getElementById("ui-alphabet-text").textContent = t.alphabetText;
    btnHira.textContent = t.hiraBtn;
    btnKata.textContent = t.kataBtn;
    document.getElementById("ui-mode-text").textContent = t.modeText;
    btnManual.textContent = t.manualBtn;
    btnQuiz.textContent = t.quizBtn;
    startBtn.textContent = t.startBtn;
    backBtn.textContent = t.backBtn;
    answerInput.placeholder = t.placeholder;
    checkBtn.textContent = t.checkBtn;

    btnLearn.textContent = t.learnBtn;
    document.getElementById("ui-flip-hint").textContent = t.flipHint;
    btnLearnCorrect.textContent = t.btnRemember;
    btnLearnWrong.textContent = t.btnForget;

    btnKanji.textContent = t.kanjiBtn;
    document.getElementById("ui-kanji-title").textContent = t.kanjiTitle;
    newKanjiChar.placeholder = t.kanjiCharPlace;
    newKanjiMeaning.placeholder = t.kanjiMeanPlace;
    btnAddKanji.textContent = t.kanjiAddBtn;


    // Меняем активные кнопки языка
    if (currentLang === 'ru') {
        btnLangRu.classList.add("active");
        btnLangEn.classList.remove("active");
    } else {
        btnLangEn.classList.add("active");
        btnLangRu.classList.remove("active");
    }
    
    // Сохраняем выбор
    localStorage.setItem('kanaLang', currentLang);
}

// Слушатели для смены языка
btnLangRu.addEventListener("click", () => { currentLang = 'ru'; applyLanguage(); });
btnLangEn.addEventListener("click", () => { currentLang = 'en'; applyLanguage(); });

// Применяем язык при старте страницы
applyLanguage();

// Функция загрузки данных
function loadData() {
    const storageKey = 'kanaAppDB_' + currentAlphabet;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
        kanaData = JSON.parse(savedData);
    } else {
        // Если это кандзи, стартовая база пустая. Иначе берем азбуку.
        let sourceData = [];
        if (currentAlphabet === 'hiragana') sourceData = hiraganaData;
        if (currentAlphabet === 'katakana') sourceData = katakanaData;
        
        kanaData = JSON.parse(JSON.stringify(sourceData)); 
    }
}

// Функция сохранения
function saveData() {
    const storageKey = 'kanaAppDB_' + currentAlphabet;
    localStorage.setItem(storageKey, JSON.stringify(kanaData));
}

// Функция переключения азбуки
function switchAlphabet(alphabet, activeBtn, inactiveBtn1, inactiveBtn2) {
    currentAlphabet = alphabet;
    activeBtn.classList.add("active");
    inactiveBtn1.classList.remove("active");
    inactiveBtn2.classList.remove("active");
    
    // Показываем редактор ТОЛЬКО для Кандзи
    if (alphabet === 'kanji') {
        kanjiCreator.style.display = "block";
    } else {
        kanjiCreator.style.display = "none";
    }
    
    loadData(); // Сразу подгружаем базу при переключении вкладки в меню
}

function switchMode(mode, activeBtn, inactiveBtn1, inactiveBtn2) {
    currentMode = mode;

    // Визуальное переключение кнопок
    activeBtn.classList.add("active");
    inactiveBtn1.classList.remove("active");
    inactiveBtn2.classList.remove("active");

    if (currentMode === 'manual') {
        manualContainer.style.display = "block";
        quizContainer.style.display = "none";
        learningContainer.style.display = "none";
        charElement.style.display = "block"; // Показываем обычный символ
    } else if (currentMode === 'quiz') {
        manualContainer.style.display = "none";
        quizContainer.style.display = "grid";
        learningContainer.style.display = "none";
        charElement.style.display = "block"; // Показываем обычный символ
    } else if (currentMode === 'learning') {
        manualContainer.style.display = "none";
        quizContainer.style.display = "none";
        learningContainer.style.display = "block"; // Показываем флэш-карточку
        charElement.style.display = "none"; // Прячем обычный символ
    }
}

// Слушатели для кнопок
btnHira.addEventListener("click", () => switchAlphabet('hiragana', btnHira, btnKata, btnKanji));
btnKata.addEventListener("click", () => switchAlphabet('katakana', btnKata, btnHira, btnKanji));
btnKanji.addEventListener("click", () => switchAlphabet('kanji', btnKanji, btnHira, btnKata));


btnManual.addEventListener("click", () => switchMode('manual', btnManual, btnQuiz, btnLearn));
btnQuiz.addEventListener("click", () => switchMode('quiz', btnQuiz, btnManual, btnLearn));
btnLearn.addEventListener("click", () => switchMode('learning', btnLearn, btnManual, btnQuiz));

// Запуск при загрузке страницы (по умолчанию Хирагана)
btnHira.classList.add("active");

// 3. Отбираем карточки, время которых уже подошло
function getDueCards() {
    const now = Date.now();
    return kanaData.filter(card => card.next_review <= now);
}

// Логика добавления своего кандзи
btnAddKanji.addEventListener("click", () => {
    const char = newKanjiChar.value.trim();
    const meaning = newKanjiMeaning.value.trim();
    
    if (char === "" || meaning === "") return;
    
    const newCard = {
        id: "kanji_" + Date.now(), // Уникальный ID на основе текущего времени
        char: char,
        romaji: meaning, // Мы хитро используем поле romaji для задней части флэш-карточки
        interval: 0,
        ease: 2.5,
        reps: 0,
        next_review: 0 // Сразу готово к изучению
    };
    
    kanaData.push(newCard);
    saveData();
    
    // Очищаем поля и показываем сообщение об успехе
    newKanjiChar.value = "";
    newKanjiMeaning.value = "";
    kanjiFeedback.textContent = translations[currentLang].kanjiAdded + char;
    setTimeout(() => kanjiFeedback.textContent = "", 2000);
});

// ОБНОВЛЕННАЯ ФУНКЦИЯ ПОКАЗА КАРТОЧКИ
function showNextCard() {
    const dueCards = getDueCards();
    
    if (dueCards.length === 0) {
        charElement.textContent = " ";
        feedbackElement.textContent = translations[currentLang].feedbackDone;
        manualContainer.style.display = "none";
        quizContainer.style.display = "none";
        return;
    }

    currentCard = dueCards[Math.floor(Math.random() * dueCards.length)];
    charElement.textContent = currentCard.char;
    feedbackElement.textContent = "";

    if (currentMode === 'learning') {
        // Заполняем флэш-карточку
        learnChar.textContent = currentCard.char;
        learnRomaji.textContent = currentCard.romaji;
        // Сбрасываем переворот и прячем кнопки ответа
        flashcard.classList.remove("flipped");
        learningButtons.style.display = "flex";

    } else if (currentMode === 'manual') {
        charElement.textContent = currentCard.char;
        answerInput.value = "";
        answerInput.focus();
    } else {
        charElement.textContent = currentCard.char;
        setupQuiz(); 
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
        // Включаем кнопки и СБРАСЫВАЕМ ЦВЕТА от предыдущей карточки
        btn.disabled = false;
        btn.classList.remove("correct", "wrong"); 

        if (index < maxOptions) {
            btn.style.display = "block";
            btn.textContent = options[index];
            
            btn.onclick = () => {
                // Блокируем все кнопки
                quizButtons.forEach(b => b.disabled = true);

                if (btn.textContent === currentCard.romaji) {
                    // Правильно: красим текущую кнопку в зеленый
                    btn.classList.add("correct");
                    handleCorrect(false); // Вызываем без текста
                } else {
                    // Ошибка: красим текущую в красный
                    btn.classList.add("wrong");
                    
                    // Находим правильную кнопку и подсвечиваем ее зеленым
                    quizButtons.forEach(b => {
                        if (b.textContent === currentCard.romaji) {
                            b.classList.add("correct");
                        }
                    });
                    
                    handleIncorrect(false); // Вызываем без текста
                }
            };
        } else {
            btn.style.display = "none";
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

    // РАЗДЕЛЕНИЕ ВРЕМЕНИ:
    // Если азбука - множитель 1 минута (60 * 1000)
    // Если кандзи - множитель 1 день (24 часа * 60 мин * 60 сек * 1000 мс)
    const timeMultiplier = (currentAlphabet === 'kanji') ? (24 * 60 * 60 * 1000) : (60 * 1000); 
    
    currentCard.next_review = Date.now() + (currentCard.interval * timeMultiplier);
    saveData();
}
// ПЕРЕХОД МЕЖДУ ОКНАМИ
startBtn.addEventListener("click", () => { // тут логика переключения классов active, как у других кнопок; 
                                        // currentMode = 'learning'; });
    // 1. Загружаем базу на основе выбранной азбуки
    loadData(); 
    
    // 2. Скрываем меню, показываем экран обучения
    startScreen.style.display = "none";
    studyScreen.style.display = "block";
    
    // 3. Показываем нужный блок ввода в зависимости от режима
    if (currentMode === 'manual') {
        manualContainer.style.display = "block";
        quizContainer.style.display = "none";
        learningContainer.style.display = "none";
        charElement.style.display = "block"; // Показываем обычный символ
    } else if (currentMode === 'quiz') {
        manualContainer.style.display = "none";
        quizContainer.style.display = "grid";
        learningContainer.style.display = "none";
        charElement.style.display = "block"; // Показываем обычный символ
    } else if (currentMode === 'learning') {
        manualContainer.style.display = "none";
        quizContainer.style.display = "none";
        learningContainer.style.display = "block"; // Показываем флэш-карточку
        charElement.style.display = "none"; // Прячем обычный символ
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


flashcard.addEventListener("click", () => {
    flashcard.classList.toggle("flipped");
});

function handleLearningAnswer(isCorrect) {
    // 1. Начинаем переворот карточки обратно (если она была перевернута)
    flashcard.classList.remove("flipped");
    
    // 2. Ждем 300 миллисекунд, пока она визуально крутится, и меняем символ
    setTimeout(() => {
        if (isCorrect) {
            handleCorrect(false); 
        } else {
            handleIncorrect(false); 
        }
    }, 300);
}

// Кнопки ответа
btnLearnCorrect.addEventListener("click", () => {
    handleLearningAnswer(true);
});

btnLearnWrong.addEventListener("click", () => {
    handleLearningAnswer(false);
});

// ОБЩИЕ ФУНКЦИИ ДЛЯ ПРОВЕРКИ
function handleCorrect(showText = true) {
    if (showText) {
        feedbackElement.textContent = translations[currentLang].feedbackCorrect;
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = ""; 
    }
    processAnswer(true);


    const delay = (currentMode === 'learning') ? 0 : 1000;
    setTimeout(showNextCard, delay);
}

function handleIncorrect(showText = true) {
    if (showText) {
        feedbackElement.textContent = translations[currentLang].feedbackError + currentCard.romaji;
        feedbackElement.style.color = "red";
    } else {
        feedbackElement.textContent = ""; 
    }
    processAnswer(false);


    const delay = (currentMode === 'learning') ? 0 : 2000;
    setTimeout(showNextCard, delay); 
}

// Проверка для ручного ввода
function checkManualAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const isCorrect = 
    (userAnswer === currentCard.romaji) || // срабатывает для азбуки
    (currentCard.meaning && userAnswer === currentCard.meaning) || // проверка перевода кандзи
    (currentCard.kunyomi && userAnswer === currentCard.kunyomi) || // проверка кунного чтения
    (currentCard.onyomi && userAnswer === currentCard.onyomi);     // проверка онного чтения

    if (isCorrect) {
        handleCorrect(true); 
    } else {
        handleIncorrect(true); 
    }
}

// Обновляем слушатели для ручного ввода
checkBtn.addEventListener("click", checkManualAnswer);
answerInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") checkManualAnswer();
});
