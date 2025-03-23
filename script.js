const bird = document.getElementById("bird");
const birdImage = document.getElementById("bird-image");
const lowerPlayground = document.getElementById("lower-playground");
const upperPlayground = document.getElementById("upper-playground");
const scoreCounter = document.getElementById("score");

const playground = document.getElementById("playground");

let timeSinceLastSucess = 0;
let score = 0;
let pipeIntervals = [];
let heightDifferencePipe = 50;
let gameStarted = false;
let intervalDown;
let heightOfSinglePipe;
let timeoutDown;
let intervalUp;

document.addEventListener("mouseup", () => {
  if (!gameStarted) {
    gameStarted = true;

    setTimeout(() => {
      movePipe(false);
      movePipe(true);

      const interval_id1 = setInterval(() => {
        movePipe(false);
      }, 3500);
      const interval_id2 = setInterval(() => {
        movePipe(true);
      }, 3500);

      pipeIntervals.push(interval_id1);
      pipeIntervals.push(interval_id2);
    }, 1000);
  }
  birdJump();
});

function birdJump() {
  if (intervalDown) clearInterval(intervalDown);
  if (intervalUp) clearTimeout(intervalUp);

  let i = 0;

  intervalUp = setInterval(() => {
    bird.style.top = bird.getBoundingClientRect().top - 70 / 100 + "px";
    i++;

    requestAnimationFrame(() => {
      birdImage.style.transform = "rotate(-50deg)";
    });

    if (isBirdTouchingPipe()) {
      console.log("Touching");
      alert("Touching");
      clearInterval(intervalDown);
      fail();
      return;
    }
    if (Date.now() - timeSinceLastSucess > 1500 && isBirdBetweenPipes()) {
      score++;
      scoreCounter.innerText = score;
    }

    if (i >= 100) {
      clearInterval(intervalUp);
      moveBirdDown();
    }
  }, 1);
}
function removeAllPipes() {
  const pipes = document.getElementsByClassName("pipe");

  Array.from(pipes).forEach((pipe) => {
    pipe.remove();
  });
}
function resetBirdPos() {
  bird.style.top =
    (playground.getBoundingClientRect().top +
      playground.getBoundingClientRect().bottom) /
      2 +
    "px";
}

function fail() {
  gameStarted = false;
  score = 0;
  scoreCounter.innerText = score;
  for (let i = 0; i < pipeIntervals.length; i++) {
    clearInterval(pipeIntervals[i]);
  }
  pipeIntervals = [];

  removeAllPipes();
  resetBirdPos();
}

function moveBirdDown() {
  let i = bird.getBoundingClientRect().top;
  let counter = 1;

  intervalDown = setInterval(() => {
    if (isBirdTouchingPipe()) {
      console.log("Touching");
      alert("Touching");
      clearInterval(intervalDown);
      fail();
      return;
    }
    if (Date.now() - timeSinceLastSucess > 1500 && isBirdBetweenPipes()) {
      score++;
      scoreCounter.innerText = score;
    }
    if (
      bird.getBoundingClientRect().bottom >
      playground.getBoundingClientRect().bottom
    ) {
      fail();
      clearInterval(intervalDown);
      return;
    }

    if (counter < 50) {
      requestAnimationFrame(() => {
        birdImage.style.transform = "rotate(" + 0 + "deg)";
      });
    }

    if (counter > 50 && counter * 0.3 < 80) {
      requestAnimationFrame(() => {
        birdImage.style.transform = "rotate(" + counter * 0.3 + "deg)";
      });
    }

    i++;

    bird.style.top = i + "px";
    counter++;
  }, 5);
}

function movePipe(bottom) {
  console.log("Pipe spawned");

  const pipe = document.createElement("div");
  let i = playground.getBoundingClientRect().left;

  if (bottom) {
    lowerPlayground.appendChild(pipe);
    pipe.style.borderBottom = "none";
    pipe.style.setProperty("--pipe-top-offset", "-10px");
    pipe.style.setProperty("--pipe-bottom-offset", "auto");
  } else {
    upperPlayground.appendChild(pipe);
    pipe.style.borderTop = "none";
    pipe.style.setProperty("--pipe-top-offset", "auto");
    pipe.style.setProperty("--pipe-bottom-offset", "-10px");
  }

  let heightInPercent;
  if (!bottom) {
    heightInPercent = Math.floor(Math.random() * 30) + 10;
    heightOfSinglePipe = heightInPercent;
  } else {
    heightInPercent = heightDifferencePipe - heightOfSinglePipe;
  }

  pipe.classList.add("pipe");
  pipe.style.height = heightInPercent + "%";
  pipe.style.width = "5%";

  const interval = setInterval(() => {
    i++;
    pipe.style.right = i + "px";

    if (
      pipe.getBoundingClientRect().left <
      playground.getBoundingClientRect().left
    ) {
      clearInterval(interval);
      pipe.remove();
    }
  }, 10);
}

function isBirdTouchingPipe() {
  const pipes = document.getElementsByClassName("pipe");
  let isTouching = false;

  Array.from(pipes).forEach((pipe) => {
    if (isPipeTouchingBird(pipe)) {
      console.log("true...");
      isTouching = true;
    }
  });
  return isTouching;
}

function isPipeTouchingBird(pipe) {
  const birdLeftPos = bird.getBoundingClientRect().left;
  const birdRightPos = bird.getBoundingClientRect().right;

  const birdTopPos = bird.getBoundingClientRect().top;
  const birdBottomPos = bird.getBoundingClientRect().bottom;

  if (isPipeTop(pipe)) {
    return (
      ((birdRightPos > pipe.getBoundingClientRect().left &&
        birdRightPos < pipe.getBoundingClientRect().right) ||
        (birdLeftPos > pipe.getBoundingClientRect().left &&
          birdLeftPos < pipe.getBoundingClientRect().right)) &&
      pipe.getBoundingClientRect().bottom > birdTopPos
    );
  } else {
    return (
      ((birdRightPos > pipe.getBoundingClientRect().left &&
        birdRightPos < pipe.getBoundingClientRect().right) ||
        (birdLeftPos > pipe.getBoundingClientRect().left &&
          birdLeftPos < pipe.getBoundingClientRect().right)) &&
      pipe.getBoundingClientRect().top < birdBottomPos
    );
  }
}

function isBirdBetweenPipes() {
  const birdTop = bird.getBoundingClientRect().top;
  const birdBottom = bird.getBoundingClientRect().bottom;
  const birdLeft = bird.getBoundingClientRect().left;
  const birdRight = bird.getBoundingClientRect().right;

  const pipes = document.getElementsByClassName("pipe");
  let isBetween = false;

  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    const pipeLeft = pipe.getBoundingClientRect().left;
    const pipeRight = pipe.getBoundingClientRect().right;

    if (!(birdLeft > pipeLeft && birdLeft < pipeRight)) continue;

    if (isPipeTop(pipe)) {
      isBetween = birdTop > pipe.getBoundingClientRect().bottom;
    } else {
      isBetween = birdBottom < pipe.getBoundingClientRect().top;
    }
  }

  console.log("IsBetween: " + isBetween);
  if (isBetween) timeSinceLastSucess = Date.now();
  return isBetween;
}

function isPipeTop(pipe) {
  return inBound(
    pipe.getBoundingClientRect().top,
    playground.getBoundingClientRect().top,
    10
  );
}

function inBound(a, b, bound) {
  return (a - bound < b && a + bound > b) || (b - bound < a && b + bound > a);
}
