function name(matt) {
    console.log("Yo " + matt);
}

function nameAgain(name) {
    console.log("YoYo " + name);
}
function rant(message) {
    console.log(message.toUpperCase());
    console.log(message.toUpperCase());
    console.log(message.toUpperCase());
}

function repeat(str, numTimes) {
    let result = " ";
    for (let i = 0; i < numTimes; i++) {
        result += str;
    }
    console.log(result);
}

function isSnakeEyes(dieOne, dieTwo) {
    if (dieOne === 1 && dieTwo === 1) {
        console.log("Snake Eyes!");
    } else {
        console.log("Not Snake Eyes!");
    }
}

function isShortsWeather(temp) {
    if (temp >= 75) {
        return true;
    }
    return false;
}

//Function should return last element of array without removing element. If array is empty it should return null
function lastElement(arr) {
    if (arr.length < 1) {
        return null;
    }
    return arr[arr.length - 1];
}

//Function that capitalizes 1st letter of string input
function capitalize(strAgain) {
    let upper = strAgain[0].toUpperCase();
    let restOf = strAgain.slice(1, strAgain.length);

    return upper + restOf;
}

//Function that calculates all numbers in an array
function sumArray(arrNums) {
    let total = 0;
    // let oneNum = arrNums.length;
    for (let i = 0; i < arrNums.length; i++) {
        total += arrNums[i];
    }
    return total;
}

//Function takes in one parameter and returns day of week. HINT: Store days of week in an array or use an object with numerical kewys. When function is called, plug the number into the array/object youve created to retrieve teh corresponding day name and then return that value.
function returnDay(numDay) {
    if (numDay < "1" || numDay > "7") {
        return null;
    } else if (numDay === 1) {
        return "Monday";
    } else if (numDay === 2) {
        return "Tuesday";
    } else if (numDay === 3) {
        return "Wednesday";
    } else if (numDay === 4) {
        return "Thursday";
    } else if (numDay === 5) {
        return "Friday";
    } else if (numDay === 6) {
        return "Saturday";
    } else {
        return "Sunday";
    }
}
// returnDay;
