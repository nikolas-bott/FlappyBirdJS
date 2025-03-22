const bird = document.getElementById("bird");
const lowerPlayground = document.getElementById("lower-playground");
const upperPlayground = document.getElementById("upper-playground");

const playground = document.getElementById("playground");

let intervalDown;
let timeoutDown;
let intervalUp;

document.addEventListener("DOMContentLoaded", () => {
  moveBirdDown();
  setInterval(() => {
    moveBox(false);
  }, 2000);
  setInterval(() => {
    moveBox(true);
  }, 2000);
});
document.addEventListener("mouseup", () => {
  birdJump();
});

function birdJump() {
  if (intervalDown) clearInterval(intervalDown);
  if (timeoutDown) clearTimeout(timeoutDown);

  let i = 0;

  intervalUp = setInterval(() => {
    bird.style.top = bird.getBoundingClientRect().top - 125 / 250 + "px";
    i++;
    if (i >= 250) {
      clearInterval(intervalUp);
    }
  }, 1);

  timeoutDown = setTimeout(() => {
    moveBirdDown();
  }, 250);
}

function moveBirdDown() {
  let i = bird.getBoundingClientRect().top;

  intervalDown = setInterval(() => {
    if (
      bird.getBoundingClientRect().bottom >
      playground.getBoundingClientRect().bottom
    ) {
      clearInterval(intervalDown);
      return;
    }
    i++;
    bird.style.top = i + "px";
  }, 5);
}

function moveBox(bottom) {
  const box = document.createElement("div");
  let i = playground.getBoundingClientRect().left;
  if (bottom) {
    lowerPlayground.appendChild(box);
  } else {
    upperPlayground.appendChild(box);
  }

  box.classList.add("barrier");
  box.style.height = "30%";
  box.style.width = "5%";

  const interval = setInterval(() => {
    console.log("test");
    i++;
    box.style.right = i + "px";

    if (
      box.getBoundingClientRect().right <
      playground.getBoundingClientRect().left
    ) {
      clearInterval(interval);
      box.remove();
    }
  }, 10);
}
