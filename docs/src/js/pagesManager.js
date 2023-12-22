const mainPage = document.querySelector(".mainPage");
const wikiPage = document.querySelector(".wikiPage");
const leaderboardPage = document.querySelector(".leaderboardPage");
const signupPage = document.querySelector(".signupPage");
const loginPage = document.querySelector(".loginPage");
const profilePage = document.querySelector(".profilePage");

var sortingMethod = "level"

function main(){
    mainPage.classList.remove("hidden");
    leaderboardPage.classList.add("hidden");
    signupPage.classList.add("hidden");
    loginPage.classList.add("hidden");
    profilePage.classList.add("hidden");

}

function leaderboard(){
    mainPage.classList.add("hidden");
    leaderboardPage.classList.remove("hidden");
    signupPage.classList.add("hidden");
    loginPage.classList.add("hidden");
    profilePage.classList.add("hidden");

    constructLeaderBoard("level")
}

function login(){
    mainPage.classList.add("hidden");
    leaderboardPage.classList.add("hidden");
    signupPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
    profilePage.classList.add("hidden");

}

function signUp(){
    mainPage.classList.add("hidden");
    leaderboardPage.classList.add("hidden");
    signupPage.classList.remove("hidden");
    loginPage.classList.add("hidden");
    profilePage.classList.add("hidden");
}
function profile(){
    mainPage.classList.add("hidden");
    leaderboardPage.classList.add("hidden");
    signupPage.classList.add("hidden");
    loginPage.classList.add("hidden");
    profilePage.classList.remove("hidden");
}

function copyID(){
    var copyText = document.getElementById("idInfo");
    var textArea = document.createElement("textarea");
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    navigator.clipboard.writeText(textArea.value);
    textArea.remove();
    alert("Copied to clipboard")
}