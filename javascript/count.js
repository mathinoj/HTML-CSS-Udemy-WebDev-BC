//HAD THIS PART HERE BUT THIS IS WHAT WAS MESSING THINGS UP. REMOVED IT AND CHANGED A FEW OTHER THINGS JUST TO CLEAN UP, AND NOW THINGS WORK PROPERLY!!
// let upButton = document.querySelector("#upOneClick");
// upButton.addEventListener("click", buttClick);

// let start = 0;

// function buttClick(e) {
//     start++;
//     // let showScoreThis = document.getElementById("one").innerHTML;
//     // console.log("NEED THIS one: " + showScoreThis);
//     const scored = document.querySelector("#one");
//     // console.log("NEED THIS one: " + start);
//     let matt = (scored.innerText = start);
//     console.log("NEED THIS one: " + matt);
// }

//THIS BRINGS SCORES DOWN - P1
let dButtonP1 = document.querySelector("#downOneClick");
dButtonP1.addEventListener("click", function (e) {
    let subtractScore = document.getElementById("one").innerText;

    subtractScore--;

    const scoreSubtract = document.querySelector("#one");
    scoreSubtract.innerText = subtractScore;
    console.log("Down P1: " + subtractScore);
});

//THIS BRINGS SCORES UP - P1
let upButtP1 = document.querySelector("#upOneClick");
upButtP1.addEventListener("click", function (e) {
    let addScore = document.getElementById("one").innerText;

    addScore++;

    const scoringAdd = document.querySelector("#one");
    scoringAdd.innerText = addScore;
    console.log("Up P1: " + addScore);
});

//THIS BRINGS SCORE DOWN - P2
let dButtonP2 = document.querySelector("#downOneClick2");
dButtonP2.addEventListener("click", function (e) {
    let subtractScoreP2 = document.getElementById("two").innerText;

    subtractScoreP2--;

    const scoreSubtractP2 = document.querySelector("#two");
    scoreSubtractP2.innerText = subtractScoreP2;
    console.log("Down P2 " + subtractScoreP2);
});

//THIS BRINGS SCORE UP - P2
let upButtP2 = document.querySelector("#upOneClick2");
upButtP2.addEventListener("click", function (e) {
    let addScoreP2 = document.getElementById("two").innerText;

    addScoreP2++;

    const scoring2 = document.querySelector("#two");
    scoring2.innerText = addScoreP2;
    console.log("Up P2 " + addScoreP2);
});

//THIS RESETS BOTH SCORES
var resetButt = document.querySelector("#resetClick");
resetButt.addEventListener("click", resetClicker);

let resetStart = 0;

function resetClicker() {
    const resetUno = document.querySelector("#one");
    const resetTwo = document.querySelector("#two");
    const resetSetScore = document.querySelector("#reachPoint");
    // const resetP1Name = document.querySelector("#oneName");
    // const resetP2Name = document.querySelector("#twoName");

    // start = 0;
    // startToo = 0;
    resetUno.innerText = resetStart;
    resetTwo.innerText = resetStart;
    resetSetScore.innerText = resetStart;
    // resetP1Name.innerText = "P1";
    // resetP2Name.innerText = "P2";
    console.log("Reset Activated ");
}

//FUNCTION to SET SCORE
const form = document.querySelector("#scoreSet");
const userInput = document.querySelector("#setPoint");
const spanChange = document.querySelector("#reachPoint");
form.addEventListener("click", function (e) {
    e.preventDefault();
    spanChange.innerText = `${userInput.value}`;
    userInput.value = "";
});

//FUNCTION to SEE WHO GETS TO THE SET SCORE FIRST - P1
let setScoreP1 = document.querySelector("#upOneClick");
setScoreP1.addEventListener("click", function (e) {
    let grabP1Score = document.getElementById("one").innerText;

    const scoreFromP1Span = document.querySelector("#one");
    scoreFromP1Span.innerText = grabP1Score;

    let getSetScore = document.querySelector("#reachPoint").innerText;

    let name1 = document.getElementById("oneName").innerText;
    if (grabP1Score === getSetScore) {
        // alert("You win!");
        alert(`${name1} wins!`);

        alert("Click 'Reset Game' to Start a New Game.");
    }
});

//FUNCTION to SEE WHO GETS TO THE SET SCORE FIRST - P2
let setScoreP2 = document.querySelector("#upOneClick2");
setScoreP2.addEventListener("click", function (e) {
    let grabP2Score = document.getElementById("two").innerText;

    const scoreFromP2Span = document.querySelector("#two");
    scoreFromP2Span.innerText = grabP2Score;

    let getSetScore = document.querySelector("#reachPoint").innerText;

    let name2 = document.getElementById("twoName").innerText;
    if (grabP2Score === getSetScore) {
        // alert("You win!");
        alert(`${name2} wins!`);

        alert("Click 'Reset Game' to Start a New Game.");
    }
});

//FUNCTION TO SET PLAYER NAMES
const playerForm = document.querySelector("#playerName");
const nameInputP1 = document.querySelector("#setP1Name");
const nameInputP2 = document.querySelector("#setP2Name");
const nameSpanP1 = document.querySelector("#oneName");
const nameSpanP2 = document.querySelector("#twoName");
playerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    nameSpanP1.innerText = `${nameInputP1.value}`;
    nameSpanP2.innerText = `${nameInputP2.value}`;
    nameInputP1.value = "";
    nameInputP2.value = "";
});

var resetNameButt = document.querySelector("#resetNameClick");
resetNameButt.addEventListener("click", resetNameClicker);
function resetNameClicker() {
    const resetP1Name = document.querySelector("#oneName");
    const resetP2Name = document.querySelector("#twoName");
    console.log(resetP1Name);

    resetP1Name.innerText = "P1";
    resetP2Name.innerText = "P2";
    console.log("Reset Name Activated ");
}
