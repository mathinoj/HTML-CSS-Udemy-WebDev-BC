console.log("herro");
if(2 + 4 === 6){console.log('yea it dew')}
let rando = Math.random();
if(rando < 0.5){
  console.log('Your number is less than .5')
  console.log(rando);
}

// ELSE IF //

let even = Math.floor(Math.random() * 100) + 1;
// console.log("your num is " + " " + Math.floor(even));

if(even % 2 === 0){
  console.log("EVEN!! Your number is: " + even + "! This is an even number")
    } else {
    console.log("ODD number. Your number is: " + even + "! This is an odd number")
    }


    // let even = (Math.random() * 100) + 1;
    // let rounded = Math.floor(even);
    // // console.log("your num is " + " " + Math.floor(even));

    // if(rounded % 2 === 0){
    //   console.log("EVEN!! Your number is here: " + rounded + ". This is an even number")
    //     } else {
    //     console.log("ODD number. Your number is here: " + rounded + ". This is an odd number")
    //     }


    // ELSE IF ELSE
    const age = prompt('Enter age:');
    if (age <= 5){
      console.log(age + " Free - baby");
    } else if (age <= 10) {
      console.log(age + " $10 - child");
    } else if (age < 65){
      console.log(age + " $15 - adult");
    } else {
      console.log(age + " $10 - senior");
    }