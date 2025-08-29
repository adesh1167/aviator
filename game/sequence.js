let multipliers = [
    2.45,
    3.26,
    1.67,
    7.50,
    1.17,
    1.88,
    2.59,
    2.70,
    16.25,
    1.01,
    1.98,
    1.37,
    1.75,
    2.08
]

const glowColors = [
    // 'rgb(52, 180, 255, 0.6)',
    // 'rgb(145, 62, 248, 0.6)',
    // 'rgb(248, 62, 145, 0.6)',
    'rgb(2, 135, 195, 0.7)',
    'rgb(95, 50, 148, 0.9)',
    'rgb(155, 0, 138, 0.8)',
]

let multiplier = 1;

let index = 0;
let stakersArray;

function updateMultiplier() {
    multiplierElem.innerHTML = multiplier.toFixed(2) + 'x';
}

let sequenceInterval;
let nextTimeout;

let stakersCount = 0;
let stakersInterval;

function startSequence() {
    startRound();
    updateMultiplier();

    sequenceInterval = setInterval(() => {
        multiplier *= 1.01;
        if (multiplier < multipliers[index]) {
            updateMultiplier();
            updateCashouts();
            // cashoutElem1.innerHTML = (blocks[1].wagerValue * multiplier).toFixed(2);
            if (multiplier >= 2) {
                setGlowColor(glowColors[1]);
                pillars.className = 'pillars animated';
            } else if (multiplier >= 10) {
                setGlowColor(glowColors[2]);
            }
        } else {
            multiplier = multipliers[index];
            updateMultiplier();

            endRound();
            // index++;

            clearInterval(sequenceInterval);

            console.log('Resting');


            setTimeout(() => {

            }, 1000)

            setTimeout(() => {
                clearInterval(stakersInterval);
            }, 100)

            setTimeout(() => {
                cleanRound();
                console.log("5000");
                stakersCont.style.display = "none";

                index++;
                stakersCount = 1; // 0 consumed while setting interval

                let foundBelow50 = false;

                stakersArray = [];
                for (const temp of stakers[index]) {
                    const match = temp.match(/player-count">[\s]*([\d,]+)/);
                    const num = match ? parseInt(match[1].replace(/,/g, ""), 10) : NaN;

                    if (!foundBelow50) {
                        console.log("Not found below 50: ", num);
                        if (num <= 50) {
                            foundBelow50 = true;
                            stakersArray.push(temp); // keep this one
                        }
                        // else skip (num > 50)
                        
                    } else{
                        console.log("Found below 50: ", num);
                        stakersArray.push(temp)
                    }
                }

                console.log("stakers Array: ",stakersArray);
            }, 5000)

            setTimeout(() => {
                stakersCont.innerHTML = stakersArray[0];
                stakersCont.style.display = "";
                stakersInterval = setInterval(() => {
                    if (stakersArray[stakersCount]) {
                        stakersCont.innerHTML = stakersArray[stakersCount];
                        stakersCount++;
                    }
                    console.log("Stakers: ", index, stakersCount);
                }, 500)
            }, 6000)

            setTimeout(() => {
                brightenBlocks();
                gameStatus = 'ready';
                console.log("9000");
            }, 9000)

            setTimeout(() => {
                hideNextRoundLoading();
                dimControls();
                console.log("11000");
            }, 11000)

            setTimeout(() => {
                multiplier = 1;
                brightenControls();
            }, 13000)

            nextTimeout = setTimeout(() => {
                if (index < multipliers.length) startSequence();
            }, 13000) //Separated so I can stop on this timeout specifically
        }
    }, 115);
}

// startSequence();
