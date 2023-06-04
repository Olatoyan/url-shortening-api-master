"use strict";

const inputText = document.querySelector(".input__text");
const shorten = document.querySelector(".shorten");
const clear = document.querySelector(".clear");
const errorMsg = document.querySelector(".error");
const shortenBoxes = document.querySelector(".shorten__boxes");

let boxes = [];
const renderLink = function (data) {
  const html = `
      <div class="shorten__box">
        <p class="main__link">${data.original_link}</p>
        <div class="shortened__info">
          <p class="shortened__link">${data.short_link}</p>
          <button class="copy">Copy</button>
        </div>
      </div>
  
  `;

  shortenBoxes.insertAdjacentHTML("beforeend", html);

  const copyButton = document.querySelector(".copy");
  const shortenedLink = document.querySelector(".shortened__link");
  console.log(shortenedLink);
  console.log(copyButton);
  let lastCopiedButton = null;
  shortenBoxes.addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.classList.contains("copy")) {
      const short = e.target
        .closest(".shortened__info")
        .querySelector(".shortened__link").textContent;
      console.log(short);
      navigator.clipboard.writeText(short);

      // e.target.style.backgroundColor = "#232127";
      // e.target.textContent = "Copied!";
      if (lastCopiedButton) {
        lastCopiedButton.style.backgroundColor = "";
        lastCopiedButton.textContent = "Copy";
      }
      e.target.style.backgroundColor = "#232127";
      e.target.textContent = "Copied!";
      lastCopiedButton = e.target;
    }

    // if (e.target.classList.contains("clear")) {
    //   localStorage.clear();
    //   shortenBoxes.textContent = "";
    // }
  });
  boxes.push(data);
  console.log(data);
  console.log(boxes);
  localStorage.setItem("links", JSON.stringify(boxes));
};
const returnedData = JSON.parse(localStorage.getItem("links"));
console.log(returnedData);

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
  const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${link}`);
  const data = await res.json();
  console.log(data);
  renderLink(data.result);
};

inputText.addEventListener("input", function () {
  // if (!inputText.value) {
  //   inputText.style.border = "3px solid #f46262";
  //   errorMsg.style.display = "block";
  // } else {
  //   inputText.style.border = "0";
  //   errorMsg.style.display = "none";
  // }
});

// shorten.addEventListener("click", function (e) {
//   e.preventDefault();
//   if (!inputText.value) {
//     inputText.style.border = "3px solid #f46262";
//     errorMsg.style.display = "block";
//   } else {
//     let url = inputText.value.trim();
//     if (!url.startsWith("http://") && !url.startsWith("https://")) {
//       url = "https://" + url;
//     }
//     try {
//       new URL(url);
//       inputText.style.border = "0";
//       errorMsg.style.display = "none";
//       getLink(url);
//     } catch (error) {
//       inputText.style.border = "3px solid #f46262";
//       errorMsg.textContent = error;
//       console.log(error);
//     }
//   }
// });

const getURL = function (e) {
  e.preventDefault();
  let url = inputText.value.trim();
  // const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  const urlRegex = new RegExp(
    "(?:https?)://(w+:?w*)?(S+)(:d+)?(/|/([w#!:.?+=&%!-/]))?"
  );
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
      // throw new Error("Invalid URL");
    } else {
      inputText.style.border = "0";
      errorMsg.style.display = "none";
      getLink(url);
      inputText.value = "";
      // renderLink(data);
    }
    // console.log(urlRegex.test(url));
    console.log(isValidUrl(url));
  } catch (error) {
    inputText.style.border = "3px solid #f46262";
    errorMsg.style.display = "block";
    console.log(error);
    // console.log(data.error);
  }
};

shorten.addEventListener("click", getURL);
document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getURL(e);
  }
});

// getLink();
