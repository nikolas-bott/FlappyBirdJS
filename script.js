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

function fail() {}

function moveBirdDown() {
  let i = bird.getBoundingClientRect().top;

  intervalDown = setInterval(() => {
    console.log("isIt?-- " + isBirdTouchingBox());
    if (isBirdTouchingBox()) {
      console.log("Touching");
      alert("Touching");
      clearInterval(intervalDown);
      return;
    }
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

  let heightInPercent = Math.floor(Math.random() * 30) + 10;

  box.classList.add("barrier");
  box.style.height = heightInPercent + "%";
  box.style.width = "5%";

  const interval = setInterval(() => {
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

function isBirdTouchingBox() {
  const boxes = document.getElementsByClassName("barrier");
  let isTouching = false;

  Array.from(boxes).forEach((box) => {
    if (isBoxTouchingBird(box)) {
      console.log("true...");
      isTouching = true;
    }
  });
  return isTouching;
}

function isBoxTouchingBird(box) {
  const birdLeftPos = bird.getBoundingClientRect().left;
  const birdRightPos = bird.getBoundingClientRect().right;

  const birdTopPos = bird.getBoundingClientRect().top;
  const birdBottomPos = bird.getBoundingClientRect().bottom;

  if (isBoxTop(box)) {
    return (
      birdRightPos > box.getBoundingClientRect().left &&
      birdRightPos < box.getBoundingClientRect().right &&
      box.getBoundingClientRect().bottom > birdTopPos
    );
  } else {
    return (
      birdRightPos > box.getBoundingClientRect().left &&
      birdRightPos < box.getBoundingClientRect().right &&
      box.getBoundingClientRect().top < birdBottomPos
    );
  }
}

function isBoxTop(box) {
  return inBound(
    box.getBoundingClientRect().top,
    playground.getBoundingClientRect().top,
    10
  );
}

function inBound(a, b, bound) {
  return (a - bound < b && a + bound > b) || (b - bound < a && b + bound > a);
}
