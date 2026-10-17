import { hiraganaData, katakanaData } from './data.js';

let currentAlphabet = 'hiragana'; 
let kanaData = []; 
let currentCard = null;
let currentMode = 'manual';
const btnManual = document.getElementById("btn-manual");
const btnQuiz = document.getElementById("btn-quiz");
const manualContainer = document.getElementById("manual-container");
const quizContainer = document.getElementById("quiz-container");

// buttons 
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
const btnViewDeck = document.getElementById("btn-view-deck");
const deckList = document.getElementById("deck-list");

// translation
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
        kanjiAdded: "Добавлено: ",
        kanjiViewBtn: "📜 Посмотреть колоду",
        kanjiEmpty: "Колода пуста."
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
        kanjiAdded: "Added: ",
        kanjiViewBtn: "📜 View deck",
        kanjiEmpty: "Deck is empty."
    }
};

// start language (en)
let currentLang = localStorage.getItem('kanaLang') || 'en';

// buttons for languages
const btnLangRu = document.getElementById("lang-ru");
const btnLangEn = document.getElementById("lang-en");

function applyLanguage() {
    const t = translations[currentLang];
    
    // change lang.
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
    btnViewDeck.textContent = t.kanjiViewBtn;

    if (currentLang === 'ru') {
        btnLangRu.classList.add("active");
        btnLangEn.classList.remove("active");
    } else {
        btnLangEn.classList.add("active");
        btnLangRu.classList.remove("active");
    }
    
    // save choise 
    localStorage.setItem('kanaLang', currentLang);
}

btnLangRu.addEventListener("click", () => { currentLang = 'ru'; applyLanguage(); });
btnLangEn.addEventListener("click", () => { currentLang = 'en'; applyLanguage(); });

applyLanguage();

// load data func.
function loadData() {
    const storageKey = 'kanaAppDB_' + currentAlphabet;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
        kanaData = JSON.parse(savedData);
    } else {
        // if kanji is chosen, data must be empty, else use alfabets
        let sourceData = [];
        if (currentAlphabet === 'hiragana') sourceData = hiraganaData;
        if (currentAlphabet === 'katakana') sourceData = katakanaData;
        
        kanaData = JSON.parse(JSON.stringify(sourceData)); 
    }
}

function saveData() {
    const storageKey = 'kanaAppDB_' + currentAlphabet;
    localStorage.setItem(storageKey, JSON.stringify(kanaData));
}

// switch alphabets 
function switchAlphabet(alphabet, activeBtn, inactiveBtn1, inactiveBtn2) {
    currentAlphabet = alphabet;
    
    activeBtn.classList.add("active");
    inactiveBtn1.classList.remove("active");
    inactiveBtn2.classList.remove("active");

    deckList.style.display = "none";
    
    if (alphabet === 'kanji') {
        kanjiCreator.style.display = "block";
        
        btnManual.style.display = "none";
        btnQuiz.style.display = "none";
        
        switchMode('learning', btnLearn, btnManual, btnQuiz);
    } else {
        
        kanjiCreator.style.display = "none";
        
        btnManual.style.display = ""; 
        btnQuiz.style.display = ""; 
    }
    
    loadData(); 
}

function switchMode(mode, activeBtn, inactiveBtn1, inactiveBtn2) {
    currentMode = mode;

    // visual toggle for btns
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

btnHira.addEventListener("click", () => switchAlphabet('hiragana', btnHira, btnKata, btnKanji));
btnKata.addEventListener("click", () => switchAlphabet('katakana', btnKata, btnHira, btnKanji));
btnKanji.addEventListener("click", () => switchAlphabet('kanji', btnKanji, btnHira, btnKata));

btnManual.addEventListener("click", () => switchMode('manual', btnManual, btnQuiz, btnLearn));
btnQuiz.addEventListener("click", () => switchMode('quiz', btnQuiz, btnManual, btnLearn));
btnLearn.addEventListener("click", () => switchMode('learning', btnLearn, btnManual, btnQuiz));

btnHira.classList.add("active");

function getDueCards() {
    const now = Date.now();
    return kanaData.filter(card => card.next_review <= now);
}

// logic of adding ur own kanji
btnAddKanji.addEventListener("click", () => {
    const char = newKanjiChar.value.trim();
    const meaning = newKanjiMeaning.value.trim();
    
    if (char === "" || meaning === "") return;
    
    const newCard = {
        id: "kanji_" + Date.now(), // unique ID based on today's date 
        char: char,
        romaji: meaning, 
        interval: 0,
        ease: 2.5,
        reps: 0,
        next_review: 0 
    };
    
    kanaData.push(newCard);
    saveData();
    
    newKanjiChar.value = "";
    newKanjiMeaning.value = "";
    kanjiFeedback.textContent = translations[currentLang].kanjiAdded + char;
    setTimeout(() => kanjiFeedback.textContent = "", 2000);
});

// open/close deck list
btnViewDeck.addEventListener("click", () => {
    if (deckList.style.display === "none") {
        deckList.style.display = "block";
        renderDeckList(); // draw flashcards
    } else {
        deckList.style.display = "none";
    }
});

// render deck
function renderDeckList() {
    deckList.innerHTML = ""; // clear list from old writings
    const t = translations[currentLang];
    
    if (kanaData.length === 0) {
        deckList.innerHTML = `<p style="font-size: 14px; color: #666; text-align: center;">${t.kanjiEmpty}</p>`;
        return;
    }

    // for each flashcard create a stroke
    kanaData.forEach((card, index) => {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";
        item.style.padding = "5px 0";
        item.style.borderBottom = "1px solid #eee";

        const text = document.createElement("span");
        text.textContent = `${card.char} — ${card.romaji}`;
        text.style.fontSize = "16px";

        // delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.style.background = "none";
        deleteBtn.style.border = "none";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.fontSize = "16px";
        
        // logic of deleting 
        deleteBtn.onclick = () => {
            kanaData.splice(index, 1); 
            saveData(); 
            renderDeckList(); 
        };

        item.appendChild(text);
        item.appendChild(deleteBtn);
        deckList.appendChild(item);
    });
}

// func for showing up new flashcards
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
        learnChar.textContent = currentCard.char;
        learnRomaji.textContent = currentCard.romaji;
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

function setupQuiz() {
    let options = [currentCard.romaji];

    const maxOptions = Math.min(4, kanaData.length);

    // random incorrect answers
    while (options.length < maxOptions) {
        let randomCard = kanaData[Math.floor(Math.random() * kanaData.length)];
        
        if (!options.includes(randomCard.romaji)) {
            options.push(randomCard.romaji);
        }
    }

    // do right answer in random position 
    options.sort(() => Math.random() - 0.5);

    quizButtons.forEach((btn, index) => {
        btn.disabled = false;
        btn.classList.remove("correct", "wrong"); 

        if (index < maxOptions) {
            btn.style.display = "block";
            btn.textContent = options[index];
            
            btn.onclick = () => {
                // blocking all btns
                quizButtons.forEach(b => b.disabled = true);

                if (btn.textContent === currentCard.romaji) {
                    btn.classList.add("correct");
                    handleCorrect(false);
                } else {
                    btn.classList.add("wrong");
                    
                    quizButtons.forEach(b => {
                        if (b.textContent === currentCard.romaji) {
                            b.classList.add("correct");
                        }
                    });
                    
                    handleIncorrect(false); 
                }
            };
        } else {
            btn.style.display = "none";
        }
    });
}

// INTERVALS
function processAnswer(isCorrect) {
    if (isCorrect) {
        // extend interval depending on history
        if (currentCard.reps === 0) currentCard.interval = 1;
        else if (currentCard.reps === 1) currentCard.interval = 6;
        else currentCard.interval = Math.round(currentCard.interval * currentCard.ease);
        
        currentCard.reps += 1;
    } else {
        // delete progress if failed
        currentCard.reps = 0;
        currentCard.interval = 1;
        currentCard.ease = Math.max(1.3, currentCard.ease - 0.15); 
    }

    // dividing of time 
    // if alfabet - multiplier = 1 minute 
    // if kanji - multiplier = 1 day (24 hours * 60 min * 60 sec * 1000 ms)
    const timeMultiplier = (currentAlphabet === 'kanji') ? (24 * 60 * 60 * 1000) : (60 * 1000); 
    
    currentCard.next_review = Date.now() + (currentCard.interval * timeMultiplier);
    saveData();
}
// switching between windows 
startBtn.addEventListener("click", () => { 
    // currentMode = 'learning'; });
    loadData(); 
    
    startScreen.style.display = "none";
    studyScreen.style.display = "block";
    
    if (currentMode === 'manual') {
        manualContainer.style.display = "block";
        quizContainer.style.display = "none";
        learningContainer.style.display = "none";
        charElement.style.display = "block"; 
    } else if (currentMode === 'quiz') {
        manualContainer.style.display = "none";
        quizContainer.style.display = "grid";
        learningContainer.style.display = "none";
        charElement.style.display = "block"; 
    } else if (currentMode === 'learning') {
        manualContainer.style.display = "none";
        quizContainer.style.display = "none";
        learningContainer.style.display = "block"; 
        charElement.style.display = "none"; 
    }
    
    showNextCard();
});

// button to go back
backBtn.addEventListener("click", () => {
    studyScreen.style.display = "none";
    startScreen.style.display = "block";
    feedbackElement.textContent = ""; // clear text 
});


flashcard.addEventListener("click", () => {
    flashcard.classList.toggle("flipped");
});

function handleLearningAnswer(isCorrect) {
    flashcard.classList.remove("flipped");
    
    setTimeout(() => {
        if (isCorrect) {
            handleCorrect(false); 
        } else {
            handleIncorrect(false); 
        }
    }, 300);
}

btnLearnCorrect.addEventListener("click", () => {
    handleLearningAnswer(true);
});

btnLearnWrong.addEventListener("click", () => {
    handleLearningAnswer(false);
});

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

function checkManualAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const isCorrect = 
    (userAnswer === currentCard.romaji) || 
    (currentCard.meaning && userAnswer === currentCard.meaning) || 
    (currentCard.kunyomi && userAnswer === currentCard.kunyomi) || 
    (currentCard.onyomi && userAnswer === currentCard.onyomi);     

    if (isCorrect) {
        handleCorrect(true); 
    } else {
        handleIncorrect(true); 
    }
}

checkBtn.addEventListener("click", checkManualAnswer);
answerInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") checkManualAnswer();
});
