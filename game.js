document.addEventListener("DOMContentLoaded", () => {

  /* =========================
        SCENE 1 + 2 LOGIC
  ========================== */

  const startScreen = document.getElementById("start-screen");
  const scene1 = document.getElementById("scene1");
  const scene2 = document.getElementById("scene2");
  const scene3 = document.getElementById("scene3");

  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const next2Btn = document.getElementById("next2-btn");

  const basket = document.getElementById("basket");
  const counter = document.getElementById("counter");

  const correctIngredients = new Set([
    "vanilla","whippedcream","bakingpowder",
    "strawberries","eggs","butter",
    "flour","sugar","milk"
  ]);

  startBtn.onclick = () => {
    startScreen.classList.add("hidden");
    scene1.classList.remove("hidden");
  };

  nextBtn.onclick = () => {
    scene1.classList.add("hidden");
    scene2.classList.remove("hidden");
    initGame();
  };

  function initGame() {
    const ingredients = [...document.querySelectorAll(".ingredient")];
    let collected = new Set();

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const offsets = [
      [-240,-160],[-80,-200],[80,-200],[240,-140],
      [260,40],[120,180],[-120,180],[-260,40],
      [-180,-20],[180,-20],[0,-260],[0,260],
      [-300,-80],[300,-80]
    ];

    ingredients.forEach((item, i) => {
      const [ox, oy] = offsets[i % offsets.length];
      item.style.left = cx + ox + "px";
      item.style.top = cy + oy + "px";
      item.style.transform = "translate(-50%,-50%)";

      item.ondragstart = e => {
        e.dataTransfer.setData("id", item.id);
      };
    });

    basket.ondragover = e => e.preventDefault();

    basket.ondrop = e => {
      e.preventDefault();
      const id = e.dataTransfer.getData("id");
      const item = document.getElementById(id);
      if (!item) return;

      if (correctIngredients.has(id)) {
        if (collected.has(id)) return;
        collected.add(id);
        item.style.display = "none";
        counter.textContent = `${collected.size} / ${correctIngredients.size}`;

        if (collected.size === correctIngredients.size) {
          next2Btn.disabled = false;
          next2Btn.classList.add("enabled");
        }
      } else {
        basket.classList.remove("shake");
        void basket.offsetWidth;
        basket.classList.add("shake");

        setTimeout(() => {
          basket.classList.remove("shake");
        }, 400);
      }
    };
  }

  /* =========================
        SCENE 3 LOGIC
  ========================== */

  const cakeCounter = document.getElementById("cake-counter");
  const bowl = document.getElementById("bowl");
  const loading = document.getElementById("loading");
  const cakeResult = document.getElementById("cake-result");
  const envelope = document.getElementById("envelope");

  const cakeIngredients = document.querySelectorAll(".cake-ing");
  let cakeCollected = 0;
  const totalCake = cakeIngredients.length;

  const positions = [
    [-260,-160],[-120,-220],[120,-220],[260,-160],
    [300,0],[200,180],[0,220],[-200,180],[-300,0]
  ];

  cakeIngredients.forEach((ing, i) => {
    const [x,y] = positions[i];
    ing.style.left = `calc(50% + ${x}px)`;
    ing.style.top = `calc(50% + ${y}px)`;
    ing.setAttribute("draggable", "true");

    ing.addEventListener("dragstart", e => {
      e.dataTransfer.setData("id", ing.id);
    });
  });

  bowl.addEventListener("dragover", e => e.preventDefault());

  bowl.addEventListener("drop", e => {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    const ing = document.getElementById(id);
    if (!ing) return;

    ing.style.display = "none";
    cakeCollected++;
    cakeCounter.textContent = `${cakeCollected} / ${totalCake}`;

    if (cakeCollected === totalCake) {
      startBaking();
    }
  });

function launchConfetti() {
  const container = document.getElementById("confetti-container");

  for (let i = 0; i < 80; i++) {   // more pieces
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    // random color
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 60%)`;

    // starting point (center-ish)
    confetti.style.left = "50%";
    confetti.style.top = "40%";

    // BIGGER explosion
    const angle = Math.random() * Math.PI * 2;
    const distance = 350 + Math.random() * 350; // was 200–400, now 350–700

    const xMove = Math.cos(angle) * distance;
    const yMove = Math.sin(angle) * distance + 300; // extra downward force

    confetti.style.setProperty("--x-move", `${xMove}px`);
    confetti.style.setProperty("--y-move", `${yMove}px`);

    container.appendChild(confetti);

    setTimeout(() => confetti.remove(), 2600);
  }
}

function startBaking() {
  loading.classList.remove("hidden");

  setTimeout(() => {
    loading.classList.add("hidden");
    cakeResult.classList.remove("hidden");
    bowl.style.display = "none";

    // BOOM CONFETTI
    launchConfetti();

  }, 2200);
}
  envelope.addEventListener("click", () => {
    window.open("letter.pdf", "_blank");
  });

  next2Btn.addEventListener("click", () => {
    if (!next2Btn.classList.contains("enabled")) return;

    scene2.classList.add("hidden");
    scene3.classList.remove("hidden");
  });

});