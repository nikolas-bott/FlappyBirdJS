const bird = document.getElementById("bird");
const birdImage = document.getElementById("bird-image");
const lowerPlayground = document.getElementById("lower-playground");
const upperPlayground = document.getElementById("upper-playground");

const playground = document.getElementById("playground");

let intervalDown;
let heightOfSingleBox;
let timeoutDown;
let intervalUp;

document.addEventListener("DOMContentLoaded", () => {
  moveBirdDown();
  setInterval(() => {
    moveBox(false);
  }, 3500);
  setInterval(() => {
    moveBox(true);
  }, 3500);
});
document.addEventListener("mouseup", () => {
  birdJump();
});

function birdJump() {
  if (intervalDown) clearInterval(intervalDown);
  if (intervalUp) clearTimeout(intervalUp);

  let i = 0;

  intervalUp = setInterval(() => {
    console.log("JUMP!");

    bird.style.top = bird.getBoundingClientRect().top - 70 / 100 + "px";
    i++;

    requestAnimationFrame(() => {
      birdImage.style.transform = "rotate(-50deg)";
    });

    if (i >= 100) {
      clearInterval(intervalUp);
      moveBirdDown();
    }
  }, 1);
}

function fail() {}

function moveBirdDown() {
  let i = bird.getBoundingClientRect().top;
  let counter = 1;

  intervalDown = setInterval(() => {
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

    if (counter < 50) {
      requestAnimationFrame(() => {
        birdImage.style.transform = "rotate(" + 0 + "deg)";
      });
    }

    if (counter > 50 && counter * 0.3 < 80) {
      console.log("Counter: ");
      requestAnimationFrame(() => {
        birdImage.style.transform = "rotate(" + counter * 0.3 + "deg)";
      });
    }

    i++;
    console.log("Down");

    bird.style.top = i + "px";
    counter++;
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

  let heightInPercent;
  if (!bottom) {
    heightInPercent = Math.floor(Math.random() * 30) + 10;
    heightOfSingleBox = heightInPercent;
  } else {
    heightInPercent = 60 - heightOfSingleBox;
  }

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
