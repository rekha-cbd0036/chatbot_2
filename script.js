let currentLanguage = 'english';

const chatBody = document.querySelector(".chat-body");
const txtInput = document.querySelector("#txtInput");
const send = document.querySelector(".send");
const micIcon = document.querySelector("#micIcon");
const englishButton = document.getElementById('englishButton');
const kannadaButton = document.getElementById('kannadaButton');

send.addEventListener("click", () => renderUserMessage());

txtInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    renderUserMessage();
  }
});

englishButton.addEventListener('click', function () {
    setLanguage('english');
});

kannadaButton.addEventListener('click', function () {
    setLanguage('kannada');
});
// Fetch data from response.json
let responseObj; // Variable to store fetched response data

fetchData(currentLanguage);

function setLanguage(language) {
    // Reset active class on all buttons
    resetLanguageButtons();

    // Set active class on the selected button
    if (language === 'english') {
        englishButton.classList.add('active');
        currentLanguage = 'english';
        console.log("Language set to English");
    } else if (language === 'kannada') {
        kannadaButton.classList.add('active');
        currentLanguage = 'kannada';
        console.log("Language set to Kannada");
    }
    
    fetchData(currentLanguage);
}
function fetchData(language) {
    fetch(`${language}.json`)
        .then(response => response.json())
        .then(data => {
            responseObj = data;
        })
        .catch(error => console.error(`Error loading ${language} responses:`, error));
}

micIcon.addEventListener("click", startVoiceRecognition);


function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    // Set the language based on the selected button
    const languageSelect = document.querySelector('.language-button.active');
    recognition.lang = languageSelect.dataset.language;

    recognition.onresult = function (event) {
        const voiceInput = event.results[0][0].transcript;
        txtInput.value = voiceInput;
        sendMessage();
    };

    recognition.start();
}


function resetLanguageButtons() {
    // Reset active class on all buttons
    englishButton.classList.remove('active');
    kannadaButton.classList.remove('active');
}



const renderUserMessage = () => {
  const userInput = txtInput.value;
  renderMessageEle(userInput, "user");
  txtInput.value = "";
  setTimeout(() => {
    renderChatbotResponse(userInput);
    setScrollPosition();
  }, 600);
};

const renderChatbotResponse = (userInput) => {
  const res = getChatbotResponse(userInput);
  renderMessageEle(res, "chatbot");
};

const renderMessageEle = (txt, type) => {
  let className = "user-message";
  if (type === "chatbot") {
    className = "chatbot-message";
  }
  const messageEle = document.createElement("div");
  const txtNode = document.createTextNode(txt);
  messageEle.classList.add(className);
  messageEle.append(txtNode);
  chatBody.append(messageEle);
};

const getChatbotResponse = (userInput) => {
  const matchingIntent = responseObj.intents.find(intent =>
    intent.patterns.some(pattern =>
      userInput.toLowerCase().includes(pattern.toLowerCase())
    )
  );

  return matchingIntent ? getRandomResponse(matchingIntent.responses) : "Please try something else";
};

const getRandomResponse = (responses) => {
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

const setScrollPosition = () => {
  if (chatBody.scrollHeight > 0) {
    chatBody.scrollTop = chatBody.scrollHeight;
  }
};
