"use strict";
const body = document.querySelector("body");
const header = document.querySelector(".header");
const btnNav = document.querySelector(".mobile-btn-nav");
const inputText = document.querySelector(".input__text");
const shorten = document.querySelector(".shorten");
const clear = document.querySelector(".clear");
const errorMsg = document.querySelector(".error");
const disallowedLink = document.querySelector(".disallowed__link");
const shortenBoxes = document.querySelector(".shorten__boxes");

btnNav.addEventListener("click", function (e) {
  e.stopPropagation();
  header.classList.toggle("nav-open");
});

window.addEventListener("click", function () {
  header.classList.remove("nav-open");
});

let boxes = [];
const renderLink = function (data) {
  const html = `
      <div class="shorten__box">
        <p class="main__link">${data.original_link}</p>
        <div class="shortened__info">
          <p class="shortened__link">${data.short_link}</p>
          <button class="copy">Copy</button>
          <button class="delete">Delete</button>
        </div>
      </div>
  
  `;

  boxes.push(data);
  localStorage.setItem("links", JSON.stringify(boxes));
  shortenBoxes.insertAdjacentHTML("beforeend", html);
  let lastCopiedButton = null;
  const copyText = function (e) {
    e.preventDefault();
    if (e.target.classList.contains("copy")) {
      const short = e.target
        .closest(".shortened__info")
        .querySelector(".shortened__link").textContent;
      navigator.clipboard.writeText(short);

      if (lastCopiedButton) {
        lastCopiedButton.style.backgroundColor = "";
        lastCopiedButton.textContent = "Copy";
      }
      e.target.style.backgroundColor = "#232127";
      e.target.textContent = "Copied!";
      lastCopiedButton = e.target;
    }

    if (e.target.classList.contains("delete")) {
      const shortenBox = e.target.closest(".shorten__box");
      const linkElement = shortenBox.querySelector(".shortened__link");
      const linkOriginal = linkElement.textContent;

      const storedData = JSON.parse(localStorage.getItem("links"));

      const itemIndex = storedData.findIndex(
        (link) => link.short_link === linkOriginal
      );

      if (itemIndex !== -1) {
        storedData.splice(itemIndex, 1);
        localStorage.setItem("links", JSON.stringify(storedData));
      }
      shortenBox.remove();
    }
  };

  shortenBoxes.addEventListener("click", copyText);
};
const returnedData = JSON.parse(localStorage.getItem("links"));

if (!returnedData) {
  shortenBoxes.textContent = "";
} else {
  returnedData.forEach((link) => renderLink(link));
}

clear.addEventListener("click", function () {
  localStorage.clear();
  boxes = [];
  shortenBoxes.textContent = "";
});

const getLink = async function (link) {
  try {
    const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${link}`);
    const data = await res.json();

    if (res.ok) {
      // disallowedLink.textContent = err;
      disallowedLink.style.display = "none";
    }
    if (!res.ok) throw "The link you entered is a disallowed link ";
    renderLink(data.result);
  } catch (err) {
    disallowedLink.textContent = err;
    disallowedLink.style.display = "block";
    setTimeout(() => {
      // disallowedLink.textContent = err;
      disallowedLink.style.display = "none";
    }, 2000);
  }
};

const getURL = function (e) {
  e.preventDefault();
  let url = inputText.value.trim();
  const isValidUrl = (urlString) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!urlPattern.test(urlString);
  };

  try {
    if (!isValidUrl(url)) {
      inputText.style.border = "3px solid #f46262";
      errorMsg.style.display = "block";
    } else {
      inputText.style.border = "0";
      errorMsg.style.display = "none";
      getLink(url);
      inputText.value = "";
    }
  } catch (error) {
    inputText.style.border = "3px solid #f46262";
    errorMsg.style.display = "block";
  }
};

shorten.addEventListener("click", getURL);
document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getURL(e);
  }
});
