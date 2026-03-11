const calcForm = document.getElementById("calc-form");
const resultNode = document.getElementById("calc-result");
const contactForm = document.querySelector(".contact-form");
const quizForm = document.getElementById("quiz-form");
const quizResult = document.getElementById("quiz-result");
const paybackForm = document.getElementById("payback-form");
const paybackResult = document.getElementById("payback-result");
const portfolioGrid = document.getElementById("portfolio-grid");

if (calcForm && resultNode) {
  calcForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const engine = Number(document.getElementById("engine").value);
    const generation = Number(document.getElementById("generation").value);
    const tank = document.getElementById("tank").value;

    const baseByEngine = {
      4: 42000,
      6: 57000,
      8: 71000,
    };

    const generationExtra = generation === 5 ? 14000 : 0;
    const tankExtra = tank === "toroidal" ? 3500 : 1500;
    const total = baseByEngine[engine] + generationExtra + tankExtra;

    resultNode.textContent = `Ориентировочная стоимость: ${total.toLocaleString(
      "ru-RU"
    )} ₽. Точную цену назовем после диагностики.`;
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.reset();
    alert("Заявка отправлена. Мы свяжемся с вами в ближайшее время.");
  });
}

if (quizForm && quizResult) {
  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const car = document.getElementById("quiz-car").value.trim();
    const mileage = Number(document.getElementById("quiz-mileage").value);
    const engine = Number(document.getElementById("quiz-engine").value);
    const priority = document.getElementById("quiz-priority").value;

    const packageByPriority = {
      budget: { name: "Эконом", price: 42000 },
      balance: { name: "Оптимум", price: 56000 },
      premium: { name: "Премиум", price: 73000 },
    };

    const engineExtra = engine === 6 ? 9000 : engine === 8 ? 17000 : 0;
    const mileageExtra = mileage > 3000 ? 4000 : 0;
    const chosen = packageByPriority[priority];
    const total = chosen.price + engineExtra + mileageExtra;

    quizResult.textContent = `${car}: рекомендуем пакет "${chosen.name}". Ориентировочная цена: ${total.toLocaleString(
      "ru-RU"
    )} ₽.`;
  });
}

if (paybackForm && paybackResult) {
  paybackForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const mileage = Number(document.getElementById("pb-mileage").value);
    const consumption = Number(document.getElementById("pb-consumption").value);
    const petrol = Number(document.getElementById("pb-petrol").value);
    const gas = Number(document.getElementById("pb-gas").value);
    const install = Number(document.getElementById("pb-install").value);

    const monthlyLiters = (mileage / 100) * consumption;
    const monthlyPetrolCost = monthlyLiters * petrol;
    const monthlyGasCost = monthlyLiters * gas * 1.1;
    const monthlySaving = monthlyPetrolCost - monthlyGasCost;

    if (monthlySaving <= 0) {
      paybackResult.textContent =
        "При текущих параметрах экономия не рассчитана. Проверьте введенные цены и расход.";
      return;
    }

    const paybackMonths = Math.ceil(install / monthlySaving);
    const yearlySaving = Math.round(monthlySaving * 12);

    paybackResult.textContent = `Окупаемость: ${paybackMonths} мес. Экономия за год: ${yearlySaving.toLocaleString(
      "ru-RU"
    )} ₽.`;
  });
}

const loadPortfolio = async () => {
  if (!portfolioGrid) return;
  try {
    const res = await fetch("assets/examples/index.json", { cache: "no-store" });
    if (!res.ok) return;
    const files = await res.json();
    portfolioGrid.innerHTML = "";
    files
      .filter((name) => typeof name === "string")
      .forEach((name) => {
        const figure = document.createElement("figure");
        figure.className = "portfolio-item";
        const img = document.createElement("img");
        img.loading = "lazy";
        img.src = `assets/examples/${name}`;
        img.alt = "Пример установки ГБО";
        figure.appendChild(img);
        portfolioGrid.appendChild(figure);
      });
  } catch {
    // If manifest is missing, keep empty grid.
  }
};

loadPortfolio();

const revealTargets = document.querySelectorAll(
  "section, .card, .price-grid article, .portfolio-item, .messenger-card"
);

if (revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((node) => {
    node.classList.add("reveal");
    revealObserver.observe(node);
  });
}

const counters = document.querySelectorAll(".counter");

if (counters.length) {
  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || "0");
    const useGrouping = counter.dataset.group === "true";
    const duration = 1200;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      counter.textContent = useGrouping
        ? value.toLocaleString("ru-RU")
        : String(value);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.7 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}
