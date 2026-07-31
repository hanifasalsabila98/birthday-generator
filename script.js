import { db } from "./firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const birthdayId = params.get("id");
let birthdayData;

// ==========================================
// DOM ELEMENTS
// ==========================================

const startScreen = document.getElementById("start-screen");
const loadingScreen = document.getElementById("loading-screen");
const helloScreen = document.getElementById("hello-screen");
const terminalScreen = document.getElementById("terminal-screen");
const scanScreen = document.getElementById("scan-screen");
const identityScreen = document.getElementById("identity-screen");
const verifyScreen = document.getElementById("verify-screen");
const welcomeScreen = document.getElementById("welcome-screen");
const birthdayScreen = document.getElementById("birthday-screen");
const messageScreen = document.getElementById("message-screen");
const rewardScreen = document.getElementById("reward-screen");
const rewardTermsScreen = document.getElementById("reward-terms-screen");
const congratsPopup = document.getElementById("congrats-popup");
const popupTitle = document.getElementById("popup-title");
const popupDescription = document.getElementById("popup-description");
const popupCloseBtn = document.getElementById("popup-close-btn");
const birthdayLines = document.getElementById("birthday-lines");
const messageLines = document.getElementById("message-lines");
const verifyLines = document.getElementById("verify-lines");
const welcomeTitle = document.getElementById("welcome-title");
const welcomeLines = document.getElementById("welcome-lines");
const rewardTermsContent = document.getElementById("reward-terms-content");
const rewardList = document.getElementById("reward-list");

// ==========================================
// DYNAMIC TEXT
// ==========================================

const identityName = document.getElementById("identity-name");

const welcomeSubtitle =
    document.getElementById("welcome-subtitle");

const birthdayTitle =
    document.querySelector("#birthday-screen h1");

const messageTitle =
    document.querySelector("#message-screen h1");

function loadBirthdayData() {

    // ======================================
    // AUDIO
    // ======================================

    introBgm.src = birthdayData.music.intro;
    bgm.src = birthdayData.music.background;
    congrats.src = birthdayData.music.congratulations;


    // ======================================
    // BASIC INFORMATION
    // ======================================

    identityName.textContent = birthdayData.recipient;

    welcomeTitle.textContent =
        birthdayData.welcome.title;

    welcomeSubtitle.textContent =
        birthdayData.recipient;


    // ======================================
    // WELCOME SCREEN
    // ======================================

    welcomeLines.innerHTML = "";

    birthdayData.welcome.lines.forEach(text => {

        const p = document.createElement("p");

        p.textContent = text;

        welcomeLines.appendChild(p);

    });


    // ======================================
    // VERIFY SCREEN
    // ======================================

    verifyLines.innerHTML = "";

    birthdayData.verify.lines.forEach(text => {

        const p = document.createElement("p");

        p.textContent = text;

        p.classList.add("hidden");

        verifyLines.appendChild(p);

    });


    // ======================================
    // BIRTHDAY SCREEN
    // ======================================

    birthdayTitle.textContent =
        birthdayData.birthday.title;

    birthdayLines.innerHTML = "";

    birthdayData.birthday.lines.forEach(text => {

        const p = document.createElement("p");

        p.textContent = text;

        birthdayLines.appendChild(p);

    });


    // ======================================
    // MESSAGE SCREEN
    // ======================================

    messageTitle.textContent =
        birthdayData.message.title;

    messageLines.innerHTML = "";

    birthdayData.message.lines.forEach(text => {

        const p = document.createElement("p");

        p.textContent = text;

        messageLines.appendChild(p);

    });
    
    // ======================================
    // REWARD TERMS
    // ======================================
    
    rewardTermsContent.innerHTML = `
    <p>There are <strong>${birthdayData.scratch.totalCircles} mystery circles</strong></p>
    
    <p>Hidden behind them are:</p>
    
    <br>
    
    <p>🟢 ${birthdayData.scratch.greenCircles} Green Circles</p>
    <p>🔴 ${birthdayData.scratch.redCircles} Red Circles</p>
    
    <br>
    
    <p>You only have <strong>${birthdayData.scratch.scratchesAllowed} scratches</strong></p>
    
    <p>Scratch wisely and reveal as many 🟢 as possible.</p>
    
    <p>Your reward depends on how many 🟢 you reveal.</p>
    
    <br>
    
    <hr>
    
    <br>
    
    <h2>📜 Reward Terms</h2>
    
    <p>• The reward can only be redeemed <strong>once</strong></p>
    
    <p>• There is <strong>no expiry date</strong></p>
    
    <p>• Your reward remains <strong>valid for a lifetime</strong> until it has been redeemed</p>
    
    <p>• To redeem your reward, simply <strong>show a screenshot</strong> of your winning result.</p>
    `;
    
    // ======================================
    // REWARD LIST
    // ======================================
    
    rewardList.innerHTML = `
    <h2>🏆 Rewards</h2>
    
    <br>
    
    <p>🟢🟢🟢🟢🟢 → ${birthdayData.rewards.five.title}</p>
    <p>🟢🟢🟢🟢 → ${birthdayData.rewards.four.title}</p>
    <p>🟢🟢🟢 → ${birthdayData.rewards.three.title}</p>
    <p>🟢🟢 → ${birthdayData.rewards.two.title}</p>
    <p>🟢 → ${birthdayData.rewards.one.title}</p>
    `;

}

// ==========================================
// BUTTONS
// ==========================================

const startBtn = document.getElementById("start-btn");
const enterBtn = document.getElementById("enter-btn");
const nextBtn = document.getElementById("next-btn");
const rewardBtn = document.getElementById("next-message-btn");
const rewardTermsBtn = document.getElementById("reward-terms-btn");
const introBgm = document.getElementById("intro-bgm");
const bgm = document.getElementById("bgm");
const congrats = document.getElementById("congrats");

// ==========================================
// LOADING
// ==========================================

const loadingText = document.getElementById("loading-text");

// ==========================================
// SCANNING
// ==========================================

const progressFill = document.getElementById("progress-fill");
const scanPercent = document.getElementById("scan-percent");

// ==========================================
// VERIFY
// ==========================================

const accessText = document.getElementById("access-text");

// ==========================================
// REWARD VAULT
// ==========================================

// const rewardCards = document.querySelectorAll(".reward-card");
// const rewardCounter = document.getElementById("reward-counter");
// const rewardStatus = document.getElementById("reward-status");

// ==========================================
// GAME STATE
// ==========================================

let claimedRewards = 0;
const maxRewards = 3;

async function initializeBirthday() {

    if (!birthdayId) {
        alert("Birthday ID not found.");
        return;
    }

    const snapshot = await getDoc(
        doc(db, "birthdays", birthdayId)
    );

    if (!snapshot.exists()) {
        alert("Birthday not found.");
        return;
    }

    birthdayData = snapshot.data();

    loadBirthdayData();
}

initializeBirthday();

// ==========================================
// SCREEN TRANSITION
// ==========================================

function switchScreen(currentScreen, nextScreen, callback = null) {

    currentScreen.style.opacity = "0";

    setTimeout(() => {

        currentScreen.classList.add("hidden");

        nextScreen.classList.remove("hidden");

        nextScreen.style.opacity = "0";

        requestAnimationFrame(() => {
            nextScreen.style.opacity = "1";
        });

        if (callback) {
            callback();
        }

    }, 400);

}

// ==========================================
// START BUTTON
// ==========================================
startBtn.addEventListener("click", () => {

    alert("Start clicked");

    introBgm.volume = 0.5;
    introBgm.play().catch(() => {});

    switchScreen(
        startScreen,
        loadingScreen,
        loadingAnimation
    );

});

// ==========================================
// NAVIGATION BUTTONS
// ==========================================

enterBtn.addEventListener("click", () => {

    introBgm.pause();
    introBgm.currentTime = 0;
    
    bgm.volume = 0.5;
    bgm.play().catch(() => {});
    
    switchScreen(
        welcomeScreen,
        birthdayScreen,
        runBirthday
    );

});

nextBtn.addEventListener("click", () => {
    
    switchScreen(
        birthdayScreen,
        messageScreen,
        runMessage
    );

});

rewardBtn.addEventListener("click", () => {

    switchScreen(
        messageScreen,
        rewardTermsScreen
    );

});


rewardTermsBtn.addEventListener("click", () => {
    switchScreen(rewardTermsScreen, rewardScreen, initializeRewardVault);
});

// ==========================================
// PART 2
// LOADING → HELLO → TERMINAL → SCAN
// ==========================================

// ---------- LOADING ----------

function loadingAnimation() {

    let progress = 0;

    loadingText.textContent = "Loading... 0%";

    const interval = setInterval(() => {

        progress += Math.floor(Math.random() * 12) + 3;

        if (progress > 100) {
            progress = 100;
        }

        loadingText.textContent = `Loading... ${progress}%`;

        if (progress >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                switchScreen(
                    loadingScreen,
                    helloScreen
                );

            }, 500);

        }

    }, 220);

}

// ---------- HELLO ----------

helloScreen.addEventListener("click", continueFromHello, {
    once: true
});

function continueFromHello() {

    switchScreen(
        helloScreen,
        terminalScreen,
        runTerminal
    );

}

// ---------- TERMINAL ----------

function runTerminal() {

    setTimeout(() => {

        switchScreen(
            terminalScreen,
            scanScreen,
            runScan
        );

    }, 2000);

}

// ---------- SCAN ----------

function runScan() {

    let percent = 0;

    progressFill.style.width = "0%";
    scanPercent.textContent = "0%";

    const interval = setInterval(() => {

        percent++;

        progressFill.style.width = percent + "%";
        scanPercent.textContent = percent + "%";

        if (percent >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                switchScreen(
                    scanScreen,
                    identityScreen,
                    runIdentity
                );

            }, 400);

        }

    }, 40);

}

// ==========================================
// PART 3
// IDENTITY REVEAL
// ==========================================

function runIdentity() {

    const fullName = birthdayData.recipient;

    let index = 0;

    identityName.textContent = "";

    const typing = setInterval(() => {

        identityName.textContent += fullName[index];

        index++;

        if (index >= fullName.length) {

            clearInterval(typing);

            setTimeout(() => {

                switchScreen(
                    identityScreen,
                    verifyScreen,
                    runVerify
                );

            }, 1200);

        }

    }, 120);

}

// ==========================================
// PART 4
// VERIFY → WELCOME
// ==========================================

function runVerify() {

    const lines = verifyLines.querySelectorAll("p");

    // Hide everything first
    lines.forEach(line => {
        line.classList.add("hidden");
    });

    accessText.classList.add("hidden");

    // Reveal each verification line
    lines.forEach((line, index) => {

        setTimeout(() => {
            line.classList.remove("hidden");
        }, (index + 1) * 700);

    });

    // Access Granted
    setTimeout(() => {

        accessText.classList.remove("hidden");

    }, (lines.length + 1) * 700);

    // Go to Welcome screen
    setTimeout(() => {

        switchScreen(
            verifyScreen,
            welcomeScreen
        );

    }, (lines.length + 2) * 700);

}

// ==========================================
// PART 5
// WELCOME → BIRTHDAY → MESSAGE → REWARD
// ==========================================

// ---------- WELCOME ----------

//enterBtn.addEventListener("click", () => {
//
//    switchScreen(
//        welcomeScreen,
//        birthdayScreen,
//        runBirthday
//    );
//
//});

// ---------- BIRTHDAY ----------

function runBirthday() {

    const paragraphs = birthdayLines.querySelectorAll("p");

    paragraphs.forEach(p => {

        p.style.opacity = "0";
        p.style.transition = "opacity .5s";

    });

    let delay = 300;

    paragraphs.forEach(p => {

        setTimeout(() => {

            p.style.opacity = "1";

        }, delay);

        delay += 500;

    });

    nextBtn.style.opacity = "0";

    setTimeout(() => {

        nextBtn.style.opacity = "1";

    }, delay);

}

// ---------- CONTINUE ----------

//nextBtn.addEventListener("click", () => {
//
//    switchScreen(
//        birthdayScreen,
//      messageScreen,
//        runMessage
//    );
//
//});

// ---------- MESSAGE ----------

function runMessage() {

    const paragraphs = messageLines.querySelectorAll("p");

    paragraphs.forEach(p => {

        p.style.opacity = "0";
        p.style.transition = "opacity .8s";

    });

    let delay = 500;

    paragraphs.forEach(p => {

        setTimeout(() => {

            p.style.opacity = "1";

        }, delay);

        delay += 500;

    });

    rewardBtn.style.opacity = "0";

    setTimeout(() => {

        rewardBtn.style.opacity = "1";

    }, delay);

}

// ---------- CLAIM REWARDS ----------

//rewardBtn.addEventListener("click", () => {
//
//    switchScreen(
//        messageScreen,
//        rewardTermsScreen
//    );
//
//});

// ==========================================
// PLACEHOLDER
// (Implemented in Part 6)
// ==========================================

function initializeRewardVault() {

}

// ==========================================
// SCRATCH & WIN
// ==========================================

const circles = document.querySelectorAll(".scratch-circle");
const counter = document.getElementById("scratch-counter");
const status = document.getElementById("scratch-status");

// const rewardResult = document.getElementById("reward-result");
// const rewardTitle = document.getElementById("reward-title");
// const rewardDescription = document.getElementById("reward-description");

let scratchesLeft = 0;
let giftsFound = 0;



function initializeRewardVault() {

    // Validate configuration
    if (
        birthdayData.scratch.greenCircles +
        birthdayData.scratch.redCircles !==
        birthdayData.scratch.totalCircles
    ) {

        console.error("Scratch configuration is invalid.");
        return;

    }

    scratchesLeft = birthdayData.scratch.scratchesAllowed;
    giftsFound = 0;

    counter.textContent =
        `Scratches Left : ${birthdayData.scratch.scratchesAllowed}`;

    status.textContent = "Choose wisely...";

    const results = [];

    // Add green circles
    for (let i = 0; i < birthdayData.scratch.greenCircles; i++) {
        results.push(true);
    }

    // Add red circles
    for (let i = 0; i < birthdayData.scratch.redCircles; i++) {
        results.push(false);
    }

    // Shuffle
    results.sort(() => Math.random() - 0.5);

    circles.forEach((circle, index) => {

        circle.textContent = "?";
        circle.classList.remove("revealed");

        circle.style.backgroundColor = "#222";
        circle.style.borderColor = "white";

        circle.isGift = results[index];

        circle.dataset.opened = "false";

    });

}

circles.forEach(circle => {

    circle.addEventListener("click", () => {

        if (circle.dataset.opened === "true") return;
        if (scratchesLeft <= 0) return;

        circle.dataset.opened = "true";
        scratchesLeft--;

        circle.classList.add("revealed");

        circle.textContent = "";

        if (circle.isGift) {

           circle.style.backgroundColor = "#22c55e";
           circle.style.borderColor = "#22c55e";

          giftsFound++;

        } else {
            
            circle.style.backgroundColor = "#ef4444";
            circle.style.borderColor = "#ef4444";

        }

        counter.textContent = `Scratches Left : ${scratchesLeft}`;

        if (scratchesLeft === 0) {
            finishScratchGame();
        }

    });

});

function finishScratchGame(){

    bgm.pause();

    congrats.currentTime = 0;
    congrats.play();

    congrats.onended = () => {
        bgm.play();
    };

    congratsPopup.classList.add("show");

    let reward;

    switch (giftsFound) {

        case 5:
            reward = birthdayData.rewards.five;
            break;

        case 4:
            reward = birthdayData.rewards.four;
            break;
    
        case 3:
            reward = birthdayData.rewards.three;
            break;
    
        case 2:
            reward = birthdayData.rewards.two;
            break;
    
        default:
            reward = birthdayData.rewards.one;
            break;
    
    }

    popupTitle.textContent = reward.title;
    popupDescription.textContent = reward.description;

}

popupCloseBtn.addEventListener("click", () => {

    congratsPopup.classList.remove("show");

    bgm.play();

});
