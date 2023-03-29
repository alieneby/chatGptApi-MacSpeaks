let BOT_NAME = "BOT";
let PERSON_NAME = "Sajad";

// fetching user names from the server and storing them in the client
fetch("/who")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    BOT_NAME = data.ai;
    PERSON_NAME = data.user;
    get("div.left-msg .msg-info-name").innerText = BOT_NAME
    get("div.right-msg .msg-info-name").innerText = PERSON_NAME
  });



const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const msgerClear = get(".msger-header-options");



// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "iris.png";
const PERSON_IMG = "face-smile-regular.svg";

msgerClear.addEventListener("click", event => {

  fetch("/saveAndClear")
  .then((response) => response.text())
  .then((data) => {
    msgerChat.innerHTML = ""
  });
});


msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  botResponse(msgText);
});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function botResponse(msgText) {
  // fetch with get method and send msgText as a query parameter urlencoded
  fetch("/msg?msg=" + encodeURIComponent(msgText))
  .then((response) => response.text())
  .then((data) => {
    console.log(data);
    appendMessage(BOT_NAME, BOT_IMG, "left", data);
  });

}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}