const state = {
    pearls: 0,
    totalPearls: 0,
    totalClicks: 0,
    perClick: 1,
    perSecond: 0,
    upgrades: [
        {
            id: 0,
            name: "extra straw",
            desc: "+1 pearl per click",
            baseCost: 10,
            cost: 10,
            owned: 0,
            effect: "click",
            value: 1,
        },
        {
            id: 1,
            name: "tapioca scoop",
            desc: "+1 pearl per second",
            baseCost: 50,
            cost: 50,
            owned: 0,
            effect: "passive",
            value: 1,
        },
        {
            id: 2,
            name: "brown sugar drizzle",
            desc: "+3 pearls per click",
            baseCost: 200,
            cost: 200,
            owned: 0,
            effect: "click",
            value: 3,
        },
        {
            id: 3,
            name: "boba machine",
            desc: "+5 pearls per second",
            baseCost: 500,
            cost: 500,
            owned: 0,
            effect: "passive",
            value: 5,
        }, 
        {
            id: 4,
            name: "taro farm", 
            desc: "+12 pearls per second",
            baseCost: 1500,
            cost: 1500,
            owned: 0,
            effect: "passive",
            value: 12,
        },
        {
            id: 5,
            name: "boba empire",
            desc: "+40 pearls per second",
            baseCost: 5000,
            cost: 5000,
            owned: 0,
            effect: "passive",
            value: 40,
        },
    ],
};


const MILESTONES = [
    { threshold: 100, label: "100 pearls collected. YAYAYAYYAYAYYA!!!"},
    { threshold: 500, label: "500 pearls! okayy i see you!!!"},
    { threshold: 2000, label: "2k pearls! wtf"},
    { threshold: 10000, label: "10k pearls! are u ok"},
    { threshold: 50000, label: "50k pearls... are you real?!?!?!?!?!??!"},
];

const reached = new Set();

const pearlCountEl = document.getElementById("pearl-count");
const perSecEl = document.getElementById("per-sec-display");
const bobaEl = document.getElementById("boba");
const upgradesListEl = document.getElementById("upgrades-list");
const statTotal = document.getElementById("stat-total");
const statClicks = document.getElementById("stat-clicks");
const statPerClick = document.getElementById("stat-perclick");
const statPerSec = document.getElementById("stat-persec");
const milestoneListEl = document.getElementById("milestone-list");



bobaEl.addEventListener("click", (e) => {
    state.pearls += state.perClick;
    state.totalPearls += state.perClick;
    state.totalClicks++;

    bobaEl.classList.remove("clicked");
    void bobaEl.offsetWidth;
    bobaEl.classList.add("clicked");
    setTimeout(() => bobaEl.classList.remove("clicked"), 200);

    spawnFloater(e.clientX, e.clientY, state.perClick);
    updateDisplay();
});

function spawnFloater(x,y,amount) {
  const el = document.createElement("span");
  el.className = "floater";
  el.textContent = `+${amount}`;
  el.style.left = `${x-12}px`;
  el.style.top = `${y-16}px`;
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

setInterval(() => {
    if (state.perSecond > 0) {
        state.pearls += state.perSecond;
        state.totalPearls += state.perSecond;
    }
    updateDisplay();
    checkMilestones();
}, 1000);

function updateDisplay() {
    pearlCountEl.textContent = `${fmt(Math.floor(state.pearls))}🧋`;
    perSecEl.textContent = `${fmt(state.perSecond)} pearls/sec`;
    statTotal.textContent = fmt(Math.floor(state.totalPearls));
    statClicks.textContent = fmt(state.totalClicks);
    statPerClick.textContent = state.perClick;
    statPerSec.textContent = state.perSecond;
    renderUpgrades();
}


function fmt(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "m";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
    return n.toString();
}


function buildUpgradeCards() {
    upgradesListEl.innerHTML = "";
    state.upgrades.forEach((u) => {
        const card = document.createElement("div");
        card.className = "upgrade-card unaffordable";
        card.dataset.id = u.id;
        card.innerHTML = `
        <div class="upgrade-name">${u.name}</div>
        <div class="upgrade-desc">${u.desc}</div>
        <div class="upgrade-footer">
            <span class="upgrade-cost"🧋<span class="cost-val">${fmt(u.cost)}</span></span>
            <span class="upgrade-owned">owned: <span class="owned-val">${u.owned}</span></span>
            </div>
            `;

            card.addEventListener("click", () => buyUpgrade(u.id));
            upgradesListEl.appendChild(card);
    });
}


function renderUpgrades() {
    state.upgrades.forEach((u) => {
        const card = upgradesListEl.querySelector(`[data-id="${u.id}"]`);
        if (!card) return;
        card.querySelector(".cost-val").textContent = fmt(u.cost);
        card.querySelector(".owned-val").textContent = u.owned;

        const canAfford = state.pearls >= u.cost;
        card.classList.toggle("unaffordable", !canAfford);
        card.classList.toggle("affordable", canAfford);
    });
}

function buyUpgrade(id) {
    const u = state.upgrades[id];
    if (state.pearls < u.cost) return;

    state.pearls -= u.cost;
    u.owned++;
    u.cost = Math.ceil(u.baseCost * Math.pow(1.15, u.owned));

    recalcStats();
    updateDisplay();
}


function recalcStats() {
    state.perClick = 1;
    state.perSecond = 0;

    state.upgrades.forEach((u) => {
        if (u.owned === 0) return;
        if (u.effect === "click") state.perClick += u.value * u.owned;
        if (u.effect === "passive") state.perSecond += u.value * u.owned;
    });
}


function checkMilestones() {
    MILESTONES.forEach((m) => {
        if(state.totalPearls >= m.threshold && !reached.has(m.threshold)) {
            reached.add(m.threshold);
            const el = document.createElement("div");
            el.className = "milestone";
            el.textContent = m.label;
            milestoneListEl.prepend(el);
        }
    });
}

buildUpgradeCards();
updateDisplay();

