import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("API_KEY");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");

async function sendMessageToBot(message) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Você agora é um mestre em informática e em computadores, tire todas as dúvidas do usuário e recepcione ele bem.",
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(message);
  return result.response.text();
}

function appendUserMessage(message) {
  const userMessageElement = document.createElement("div");
  userMessageElement.classList.add("user-message");
  userMessageElement.textContent = message;
  chatMessages.appendChild(userMessageElement);
}

function appendBotMessage(message) {
  const botMessageElement = document.createElement("div");
  botMessageElement.classList.add("bot-message");
  botMessageElement.textContent = message;
  chatMessages.appendChild(botMessageElement);
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userMessage = userInput.value.trim();
  if (userMessage === "") return;

  appendUserMessage(userMessage);
  userInput.value = "";

  const botResponse = await sendMessageToBot(userMessage);
  appendBotMessage(botResponse);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});
