import { db } from "./firebase-config.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

alert("create.js loaded v2");
/* ==========================================
   DOM REFERENCES
========================================== */

// ==========================================
// SIDEBAR
// ==========================================

const navButtons = document.querySelectorAll(".nav-btn");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const saveStatus = document.getElementById("save-status");

// ==========================================
// PAGES
// ==========================================

const pages = document.querySelectorAll(".page");

const basicPage = document.getElementById("basic-page");
const welcomePage = document.getElementById("welcome-page");
const verifyPage = document.getElementById("verify-page");
const birthdayPage = document.getElementById("birthday-page");
const messagePage = document.getElementById("message-page");
const scratchPage = document.getElementById("scratch-page");
const rewardsPage = document.getElementById("rewards-page");
const generatePage = document.getElementById("generate-page");

// ==========================================
// BASIC INFORMATION
// ==========================================

const recipientName = document.getElementById("recipient-name");

const introMusic = document.getElementById("intro-music");
const bgmMusic = document.getElementById("bgm-music");
const congratMusic = document.getElementById("congrat-music");

// ==========================================
// WELCOME
// ==========================================

const welcomeLines = document.getElementById(
    "welcome-lines"
);

const welcomePreviewSubtitle =
    document.getElementById("welcome-preview-subtitle");

const welcomePreviewLines =
    document.getElementById("welcome-preview-lines");
// ==========================================
// VERIFY
// ==========================================

const verifyLines = document.getElementById(
    "verify-lines"
);

const verifyPreviewLines =
    document.getElementById("verify-preview-lines");

// ==========================================
// BIRTHDAY
// ==========================================

const birthdayLines =
    document.getElementById("birthday-lines");

const birthdayPreviewLines =
    document.getElementById(
        "birthday-preview-lines"
    );

// ==========================================
// MESSAGE
// ==========================================

const messageLines = document.getElementById(
    "message-lines"
);

// ==========================================
// SCRATCH GAME
// ==========================================

const boardSize = document.getElementById(
    "board-size"
);

const greenCircles = document.getElementById(
    "green-circles"
);

const redCircles = document.getElementById(
    "red-circles"
);

const scratchesAllowed = document.getElementById(
    "scratches-allowed"
);

const scratchMaxNote =
    document.getElementById("scratch-max-note");

const scratchPreview =
    document.getElementById("scratch-preview");

// ==========================================
// REWARDS
// ==========================================

const rewardList = document.getElementById(
    "reward-list"
);

const rewardCount = document.getElementById(
    "reward-count"
);

const rewardMemory = {};

// ==========================================
// SUMMARY
// ==========================================

const summaryName = document.getElementById(
    "summary-name"
);

const summaryWelcome = document.getElementById(
    "summary-welcome"
);

const summaryVerify = document.getElementById(
    "summary-verify"
);

const summaryBirthday = document.getElementById(
    "summary-birthday"
);

const summaryMessage = document.getElementById(
    "summary-message"
);

const summaryCircles = document.getElementById(
    "summary-circles"
);

// ==========================================
// GENERATOR
// ==========================================

const validationStatus = document.getElementById(
    "validation-status"
);

const generatedOutput = document.getElementById(
    "generated-output"
);

const previewButton = document.getElementById(
    "preview-btn"
);

const publishButton = document.getElementById(
    "publish-btn"
);

const resetButton = document.getElementById(
    "reset-btn"
);

/* ==========================================
   PAGE ORDER
========================================== */

const pageOrder = [
    basicPage,
    welcomePage,
    verifyPage,
    birthdayPage,
    messagePage,
    scratchPage,
    rewardsPage,
    generatePage
];

let currentPageIndex = 0;

let saveTimeout;

/* ==========================================
   HELPER FUNCTIONS
========================================== */

function getCurrentPage() {

    return pageOrder[currentPageIndex];

}

function showPage(index) {

    if (index < 0 || index >= pageOrder.length) {
        return;
    }

    currentPageIndex = index;
    
    progressText.textContent =
    `Step ${index + 1} / ${pageOrder.length}`;

    const percent =
        ((index + 1) / pageOrder.length) * 100;
    
    progressFill.style.width =
        `${percent}%`;

    pages.forEach(page => {
        page.classList.remove("active");
    });

    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    pageOrder[currentPageIndex].classList.add("active");

    navButtons[currentPageIndex].classList.add("active");

}

function nextPage() {

    if (currentPageIndex >= pageOrder.length - 1) {
        return;
    }

    showPage(currentPageIndex + 1);

}

function previousPage() {

    if (currentPageIndex <= 0) {
        return;
    }

    showPage(currentPageIndex - 1);

}

/* ==========================================
   SIDEBAR NAVIGATION
========================================== */

navButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        showPage(index);

    });

});

/* ==========================================
   INITIAL PAGE
========================================== */

showPage(0);

/* ==========================================
   PAGE BUTTONS
========================================== */

// ==========================================
// BASIC
// ==========================================

document
    .getElementById("basic-next")
    .addEventListener("click", nextPage);

// ==========================================
// WELCOME
// ==========================================

document
    .getElementById("welcome-back")
    .addEventListener("click", previousPage);

document
    .getElementById("welcome-next")
    .addEventListener("click", nextPage);

// ==========================================
// VERIFY
// ==========================================

document
    .getElementById("verify-back")
    .addEventListener("click", previousPage);

document
    .getElementById("verify-next")
    .addEventListener("click", nextPage);

// ==========================================
// BIRTHDAY
// ==========================================

document
    .getElementById("birthday-back")
    .addEventListener("click", previousPage);

document
    .getElementById("birthday-next")
    .addEventListener("click", nextPage);

// ==========================================
// MESSAGE
// ==========================================

document
    .getElementById("message-back")
    .addEventListener("click", previousPage);

document
    .getElementById("message-next")
    .addEventListener("click", nextPage);

// ==========================================
// SCRATCH
// ==========================================

document
    .getElementById("scratch-back")
    .addEventListener("click", previousPage);

document
    .getElementById("scratch-next")
    .addEventListener("click", nextPage);

// ==========================================
// REWARDS
// ==========================================

document
    .getElementById("rewards-back")
    .addEventListener("click", previousPage);

document
    .getElementById("rewards-next")
    .addEventListener("click", nextPage);

// ==========================================
// GENERATE
// ==========================================

document
    .getElementById("generate-back")
    .addEventListener("click", previousPage);

/* ==========================================
   INITIALIZATION
========================================== */

function initializeGenerator() {

    generatedOutput.value = "";

    validationStatus.textContent =
        "Ready to generate.";

    updateWelcomePreview();
    updateVerifyPreview();
    updateBirthdayPreview();
    updateMessagePreview();

    saveStatus.textContent = "✓ Saved";
    
}

document.addEventListener(
    "DOMContentLoaded",
    initializeGenerator
);

/* ==========================================
   GET INPUT VALUES
========================================== */

function getInputValues(textarea) {

    return textarea.value
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");

}

function updateWelcomePreview(){

    welcomePreviewSubtitle.textContent =
        recipientName.value.trim() || "Today's Superstar";

    welcomePreviewLines.innerHTML = "";

    getInputValues(welcomeLines).forEach(line=>{

        const p = document.createElement("p");
        p.textContent = line;
        welcomePreviewLines.appendChild(p);

    });

}

function updateVerifyPreview(){

    verifyPreviewLines.innerHTML = "";

    getInputValues(verifyLines).forEach(line=>{

        const p = document.createElement("p");
        p.textContent = `✓ ${line}`;
        verifyPreviewLines.appendChild(p);

    });

}

function updateBirthdayPreview(){

    birthdayPreviewLines.innerHTML = "";

    getInputValues(birthdayLines).forEach(line=>{

        const p = document.createElement("p");
        p.textContent = line;
        birthdayPreviewLines.appendChild(p);

    });

}

/* ==========================================
   INPUT COUNTS
========================================== */

function getWelcomeCount() {

    return getInputValues(
        welcomeLines
    ).length;

}

function getVerifyCount() {

    return getInputValues(
        verifyLines
    ).length;

}

function getBirthdayCount() {

    return getInputValues(
        birthdayLines
    ).length;

}

function getMessageCount() {

    return getInputValues(
        messageLines
    ).length;

}

/* ==========================================
   LIVE SUMMARY
========================================== */

function updateSummary() {

    summaryName.textContent =
        recipientName.value.trim() || "-";

    summaryWelcome.textContent =
        getWelcomeCount();

    summaryVerify.textContent =
        getVerifyCount();

    summaryBirthday.textContent =
        getBirthdayCount();

    summaryMessage.textContent =
        getMessageCount();

    summaryCircles.textContent =
    boardSize.value;

}

/* ==========================================
   REGISTER INPUT EVENTS
========================================== */

[
    recipientName,
    welcomeLines,
    verifyLines,
    birthdayLines,
    messageLines,
    boardSize,
    greenCircles,
    redCircles,
    scratchesAllowed
].forEach(element => {

    element.addEventListener(
        "input",
        () => {
    
            updateSummary();
            
            updateWelcomePreview();
            
            updateVerifyPreview();
            
            updateBirthdayPreview();
            
            updateMessagePreview();
    
            saveFormData();
    
        }
    );

});

/* ==========================================
   INITIALIZE SUMMARY
========================================== */

updateSummary();

function updateScratchSettings() {

    const total = Number(boardSize.value);
    const green = Number(greenCircles.value || 0);
    scratchMaxNote.textContent = `Max: ${total}`;
    greenCircles.max = total;
    scratchesAllowed.max = total;

    if (green > total) {
        greenCircles.value = total;
    }

    if (Number(scratchesAllowed.value) > total) {
        scratchesAllowed.value = total;
    }

    redCircles.value = total - green;

    updateSummary();
    
    generateScratchPreview();

}

function generateScratchPreview() {

    const total = Number(boardSize.value);

    const columns = Math.sqrt(total);

    scratchPreview.innerHTML = "";

    scratchPreview.style.display = "grid";
    scratchPreview.style.gridTemplateColumns =
        `repeat(${columns}, 40px)`;
    scratchPreview.style.gap = "8px";

    const green = Number(greenCircles.value || 0);

    const circles = [];
    
    for (let i = 0; i < green; i++) {
        circles.push("green");
    }
    
    for (let i = green; i < total; i++) {
        circles.push("red");
    }
    
    circles.sort(() => Math.random() - 0.5);
    
    circles.forEach(color => {

        const circle = document.createElement("div");
        circle.className = `preview-circle ${color}`;
        scratchPreview.appendChild(circle);
    
    });

}

boardSize.addEventListener(
    "change",
    () => {

        updateScratchSettings();

        generateScratchPreview();

        generateRewardInputs();

    }
);

boardSize.addEventListener(
    "input",
    updateSummary
); 

greenCircles.addEventListener(
    "input",
    () => {

        updateScratchSettings();

        generateRewardInputs();

    }
);

scratchesAllowed.addEventListener(
    "input",
    updateScratchSettings
);

updateScratchSettings();

function generateRewardInputs() {

    document
        .querySelectorAll(".reward-item")
        .forEach(item => {

            const green =
                item.querySelector(".reward-title")
                    .dataset.green;

            rewardMemory[green] = {

                title:
                    item.querySelector(".reward-title").value,

                description:
                    item.querySelector(".reward-description").value

            };

        });

    const total = Number(greenCircles.value);

    rewardCount.textContent = total;

    rewardList.innerHTML = "";

    for (let i = total; i >= 1; i--) {

        rewardList.innerHTML += `

<div class="reward-item">

    <h3>${i} Green</h3>

    <div class="form-group">

        <label>Reward Title</label>

        <input
            type="text"
            class="reward-title"
            data-green="${i}"
            value="${rewardMemory[i]?.title || ""}"
        >

    </div>

    <div class="form-group">

        <label>Description</label>

        <textarea
            class="reward-description"
            rows="2"
            data-green="${i}"
        >${rewardMemory[i]?.description || ""}</textarea>

    </div>

    <div class="reward-preview">

        <strong class="preview-green">
            ${i} Green
        </strong>

        <h4 class="preview-title">
            ${rewardMemory[i]?.title || "Reward Title"}
        </h4>

        <p class="preview-description">
            ${rewardMemory[i]?.description || "Reward description..."}
        </p>

    </div>

</div>

`;

    }

    attachRewardPreviewEvents();

}

function attachRewardPreviewEvents() {

    document
        .querySelectorAll(".reward-item")
        .forEach(item => {

            const title =
                item.querySelector(".reward-title");

            const description =
                item.querySelector(".reward-description");

            const previewTitle =
                item.querySelector(".preview-title");

            const previewDescription =
                item.querySelector(".preview-description");

            title.addEventListener("input", () => {

                previewTitle.textContent =
                    title.value.trim() || "Reward Title";
            
                rewardMemory[
                    title.dataset.green
                ] = {
            
                    title: title.value,
            
                    description: description.value
            
                };
            
                saveFormData();
            
            });
            
            description.addEventListener("input", () => {
            
                previewDescription.textContent =
                    description.value.trim() ||
                    "Reward description...";
            
                rewardMemory[
                    title.dataset.green
                ] = {
            
                    title: title.value,
            
                    description: description.value
            
                };
            
                saveFormData();
            
            });
            
        });
            
}

/* ==========================================
   VALIDATION
========================================== */

function validateGenerator() {

    const errors = [];

    // ======================================
    // BASIC INFORMATION
    // ======================================

    if (recipientName.value.trim() === "") {

        errors.push("• Recipient name is required.");

    }

    // ======================================
    // WELCOME
    // ======================================

    if (getInputValues(welcomeLines).length === 0) {

        errors.push("• Add at least one welcome line.");

    }

    // ======================================
    // VERIFY
    // ======================================

    if (getInputValues(verifyLines).length === 0) {

    errors.push("• Add at least one verification line.");

    }

    // ======================================
    // BIRTHDAY
    // ======================================

    if (getInputValues(birthdayLines).length === 0) {

        errors.push("• Add at least one birthday line.");

    }

    // ======================================
    // MESSAGE
    // ======================================

    if (getInputValues(messageLines).length === 0) {

        errors.push("• Add at least one message line.");

    }

    // ======================================
    // SCRATCH SETTINGS
    // ======================================

    const total = Number(boardSize.value);
    const green = Number(greenCircles.value);
    const red = Number(redCircles.value);
    const scratches = Number(scratchesAllowed.value);

    if (total <= 0) {

        errors.push("• Total circles must be greater than 0.");

    }

    if (green < 0) {

        errors.push("• Green circles cannot be negative.");

    }

    if (red < 0) {

        errors.push("• Red circles cannot be negative.");

    }

    if (green + red !== total) {

        errors.push("• Green + Red must equal Total Circles.");

    }

    if (scratches <= 0) {

        errors.push("• Scratches allowed must be greater than 0.");

    }

    if (scratches > total) {

        errors.push("• Scratches cannot exceed total circles.");

    }

    if (green === 0) {

        errors.push("• At least one green circle is recommended.");

    }

    // ======================================
    // REWARDS
    // ======================================
    
    document
    .querySelectorAll(".reward-item")
    .forEach(item => {

        const green =
            item.querySelector(".reward-title")
                .dataset.green;

        const title =
            item.querySelector(".reward-title");

        const description =
            item.querySelector(".reward-description");

        if (title.value.trim() === "") {

            errors.push(
                `• ${green} Green reward title is required.`
            );

        }

        if (description.value.trim() === "") {

            errors.push(
                `• ${green} Green reward description is required.`
            );

        }

    });

    // ======================================
    // RESULT
    // ======================================

    if (errors.length === 0) {

        validationStatus.textContent =
            "✅ Everything looks good.\nReady to generate data.js.";

        return true;

    }

    validationStatus.textContent =
        errors.join("\n");

    return false;

}

/* ==========================================
   LIVE VALIDATION
========================================== */

function enableLiveValidation() {

    document.querySelectorAll(
        "input, textarea, select"
    ).forEach(element => {

        element.addEventListener(
            "input",
            validateGenerator
        );

    });

}

/* ==========================================
   INITIALIZE
========================================== */

enableLiveValidation();

validateGenerator();

/* ==========================================
   COLLECT FORM DATA
========================================== */

function collectBasicData() {

    console.log("introMusic.value =", introMusic.value);
    console.log("bgmMusic.value =", bgmMusic.value);
    console.log("congratMusic.value =", congratMusic.value);

    return {

        recipient: recipientName.value.trim(),

        music: {
            intro: introMusic.value.trim(),

            background: bgmMusic.value.trim(),

            congratulations: congratMusic.value.trim()

        }

    };

}

function collectWelcomeData() {

    return {

        title: "WELCOME",

        lines: getInputValues(
            welcomeLines
        )

    };

}

function collectVerifyData() {

    return {

        lines: getInputValues(
            verifyLines
        ).map(line => `✓ ${line}`)

    };

}

function collectBirthdayData() {

    return {

        title: "HAPPY BIRTHDAY!",

        lines: getInputValues(
            birthdayLines
        )

    };

}

function collectMessageData() {

    return {

        title: "A LITTLE MESSAGE",

        lines: getInputValues(
            messageLines
        )

    };

}

/* ==========================================
   SCRATCH DATA
========================================== */

function collectScratchData() {

    return {

        totalCircles: Number(
            boardSize.value
        ),

        greenCircles: Number(
            greenCircles.value
        ),

        redCircles: Number(
            redCircles.value
        ),

        scratchesAllowed: Number(
            scratchesAllowed.value
        )

    };

}

/* ==========================================
   REWARD DATA
========================================== */

function collectRewardData() {

    const rewards = [];

    document
        .querySelectorAll(".reward-item")
        .forEach(item => {

            rewards.push({

                greenRequired: Number(
                    item.querySelector(".reward-title")
                        .dataset.green
                ),

                title: item
                    .querySelector(".reward-title")
                    .value
                    .trim(),

                description: item
                    .querySelector(".reward-description")
                    .value
                    .trim()

            });

        });

    return rewards;

}

/* ==========================================
   COMPLETE OBJECT
========================================== */

function buildBirthdayData() {

    const basic = collectBasicData();

    return {

        recipient: basic.recipient,

        music: basic.music,

        welcome: collectWelcomeData(),

        verify: collectVerifyData(),

        birthday: collectBirthdayData(),

        message: collectMessageData(),

        scratch: collectScratchData(),

        rewards: collectRewardData()

    };

}

/* ==========================================
   FORMATTER HELPERS
========================================== */

function escapeString(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n");

}

function quote(value) {

    return `"${escapeString(value)}"`;

}

function indent(level) {

    return "    ".repeat(level);

}

function formatArray(
    array,
    level = 0
) {

    if (!Array.isArray(array) || array.length === 0) {

        return "[]";

    }

    let result = "[\n";

    array.forEach((item, index) => {

        result +=
            indent(level + 1) +
            quote(item);

        if (index < array.length - 1) {

            result += ",";

        }

        result += "\n";

    });

    result += indent(level) + "]";

    return result;

}

/* ==========================================
   GENERATE data.js
========================================== */

function generateDataJS() {

    const data = buildBirthdayData();

    return `// ==========================================
    // BIRTHDAY DATA
    // Edit this file only.
    // Everything else will update automatically.
    // ==========================================

const birthdayData = {

    // ======================================
    // BASIC INFORMATION
    // ======================================

    name: ${quote(data.recipient)},

    introMusic: ${quote(data.music.intro)},

    backgroundMusic: ${quote(data.music.background)},

    congratsMusic: ${quote(data.music.congratulations)},


    // ======================================
    // VERIFY SCREEN
    // ======================================

    verify: ${formatArray(
        data.verify.lines,
        1
    )},


    // ======================================
    // WELCOME SCREEN
    // ======================================

    welcome: {

        title: ${quote(data.welcome.title)},

        subtitle: ${quote(data.recipient)},

        lines: ${formatArray(
            data.welcome.lines,
            2
        )}

    },


    // ======================================
    // BIRTHDAY SCREEN
    // ======================================

    birthday: {

        title: ${quote(data.birthday.title)},

        lines: ${formatArray(
            data.birthday.lines,
            2
        )}

    },


    // ======================================
    // MESSAGE SCREEN
    // ======================================

    message: {

        title: ${quote(data.message.title)},

        lines: ${formatArray(
            data.message.lines,
            2
        )}

    },
    
    
    // ======================================
    // SCRATCH GAME
    // ======================================

    scratch: {

        totalCircles: ${data.scratch.totalCircles},

        greenCircles: ${data.scratch.greenCircles},

        redCircles: ${data.scratch.redCircles},

        scratchesAllowed: ${data.scratch.scratchesAllowed}

    },


    // ======================================
    // REWARDS
    // ======================================

    rewards: {

${data.rewards.map((reward, index) => `${index > 0 ? "," : ""}
        "${reward.greenRequired}": {

            title: ${quote(reward.title)},

            description: ${quote(reward.description)}

        }`).join("")}

    }

};
`;

}

/* ==========================================
   PREVIEW
========================================== */

function previewDataJS() {

    if (!validateGenerator()) {

        generatedOutput.value = "";

        return;

    }

    generatedOutput.value = generateDataJS();

}

function saveFormData() {

    clearTimeout(saveTimeout);

    saveStatus.textContent = "Saving...";

    saveTimeout = setTimeout(() => {

        const data = {

        recipientName: recipientName.value,

        introMusic: introMusic.value,
        bgmMusic: bgmMusic.value,
        congratMusic: congratMusic.value,

        welcomeLines: welcomeLines.value,
        verifyLines: verifyLines.value,
        birthdayLines: birthdayLines.value,
        messageLines: messageLines.value,

        boardSize: boardSize.value,
        greenCircles: greenCircles.value,
        scratchesAllowed: scratchesAllowed.value,

        rewards: rewardMemory

            };

        localStorage.setItem(
            "birthdayGenerator",
            JSON.stringify(data)
        );

        saveStatus.textContent = "✓ Saved";

    }, 500);

}

function loadFormData() {

    const saved =
        localStorage.getItem("birthdayGenerator");

    if (!saved) return;

    const data = JSON.parse(saved);

    recipientName.value =
        data.recipientName || "";

    introMusic.value =
        data.introMusic || "";

    bgmMusic.value =
        data.bgmMusic || "";

    congratMusic.value =
        data.congratMusic || "";

    welcomeLines.value =
        data.welcomeLines || "";

    verifyLines.value =
        data.verifyLines || "";

    birthdayLines.value =
        data.birthdayLines || "";

    messageLines.value =
        data.messageLines || "";

    boardSize.value =
        data.boardSize || "9";

    greenCircles.value =
        data.greenCircles || "1";

    scratchesAllowed.value =
        data.scratchesAllowed || "1";

    Object.assign(
        rewardMemory,
        data.rewards || {}
    );

    updateScratchSettings();

    generateRewardInputs();
    
    updateWelcomePreview();
    updateVerifyPreview();
    updateBirthdayPreview();
    updateMessagePreview();
    
    updateSummary();

}

/* ==========================================
   COPY TO CLIPBOARD
========================================== */

function copyGeneratedData() {

    if (generatedOutput.value.trim() === "") {

        alert("Please generate data.js first.");

        return;

    }

    navigator.clipboard
        .writeText(generatedOutput.value)
        .then(() => {

            alert("Copied to clipboard!");

        })
        .catch(() => {

            alert("Unable to copy.");

        });

}

/* ==========================================
   PREVIEW BUTTON
========================================== */

previewButton.addEventListener(
    "click",
    previewDataJS
);

/* ==========================================
   AUTO PREVIEW
========================================== */

function enableAutoPreview() {

    document
        .querySelectorAll("input, textarea")
        .forEach(element => {

            element.addEventListener(
                "input",
                () => {

                    if (
                        generatedOutput.value.trim() !== ""
                    ) {

                        previewDataJS();

                    }

                }
            );

        });

}

enableAutoPreview();

publishButton.addEventListener("click", async () => {

    try {

        const birthdayData = buildBirthdayData();

        console.log("introMusic.value =", introMusic.value);
        console.log("bgmMusic.value =", bgmMusic.value);
        console.log("congratMusic.value =", congratMusic.value);

        console.log("birthdayData =", birthdayData);
        

        const docRef = await addDoc(
            collection(db, "birthdays"),
            birthdayData
        );

        const url =
            `https://hanifasalsabila98.github.io/birthday-generator/index.html?id=${docRef.id}`;

        alert(
`Published successfully!

${url}`
        );

    } catch (error) {

        alert(error.message);
        console.error(error);

    }

});

resetButton.addEventListener("click", () => {

    const confirmed = confirm(
`Are you sure?

This will remove all saved data.`
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem("birthdayGenerator");

    location.reload();

});

/* ==========================================
   INITIAL PREVIEW
========================================== */

generatedOutput.value = "";

loadFormData();

updateWelcomePreview();

updateVerifyPreview();

updateBirthdayPreview();

updateMessagePreview()
