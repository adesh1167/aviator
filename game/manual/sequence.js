const multipliers = [
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

function updateMultiplier() {
    multiplierElem.innerHTML = multiplier.toFixed(2) + 'x';
}

let sequenceInterval;
let nextTimeout;


function startSequence() {
    startRound();
    updateMultiplier();

    sequenceInterval = setInterval(() => {
        multiplier *= 1.01;
        if(multiplier < multipliers[index]){
            updateMultiplier();
            updateCashouts();
            // cashoutElem1.innerHTML = (blocks[1].wagerValue * multiplier).toFixed(2);
            if(multiplier >= 2){
                setGlowColor(glowColors[1]);
                pillars.className = 'pillars animated';
            } else if(multiplier >= 10){
                setGlowColor(glowColors[2]);
            }
        } else{
            multiplier = multipliers[index];
            updateMultiplier();

            endRound();
            index++;

            clearInterval(sequenceInterval);

            console.log('Resting');
            
            setTimeout(() => {
                cleanRound();
            }, 5000)

            setTimeout(() => {
                brightenBlocks();
                gameStatus = 'ready';
            }, 9000)

            setTimeout(() => {
                hideNextRoundLoading();
                dimControls();
            }, 11000)

            setTimeout(() => {
                multiplier = 1;
                brightenControls();
            }, 13000)

            nextTimeout = setTimeout(() => {
                if(index < multipliers.length) startSequence();
            }, 13000) //Separated so I can stop on this timeout specifically
        }
    }, 115);
}

// startSequence();