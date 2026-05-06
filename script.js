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
            baseCost: 50;
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



bobeEl.addEventListener("click", (e) => {
    state.pearls += state.perClick;
    state.totalPeals += state.perClick;
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

