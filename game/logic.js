const startButton = document.getElementById('startButton');
const balanceElem = document.getElementById('balance');
const multiplierHistories = document.getElementById('multiplierHistories');
const controls = document.getElementById('controls');

const toastContainer = document.getElementById('toastContainer');
const toast = document.getElementById('toast');
const toastMultiplier = document.getElementById('toastMultiplier');
const toastAmount = document.getElementById('toastAmount');

const sounds1 = document.getElementById('sounds1');
const sounds2 = document.getElementById('sounds2');
const sounds3 = document.getElementById('sounds3');
const sounds4 = document.getElementById('sounds4');

// let balance = 22792.07;

// setBalance(0);

// BROWSER TABS

const browserTabsLocal = localStorage.getItem('browserTabs');
if(browserTabsLocal){
    browserTabsDecoy.innerHTML = browserTabs.value = browserTabsLocal;
} else{
    browserTabsDecoy.innerHTML = browserTabs.value = 21;
}

browserTabs.addEventListener('input', ()=>{
    localStorage.setItem('browserTabs', browserTabs.value);
    browserTabsDecoy.innerHTML = browserTabs.value;
})

gameStatus = 'flying';

const staked1 = false;
const controlsBlock1 = document.getElementById('controlsBlock1');
const input1 = document.getElementById('wagerInput1')
const controlButtons1 = document.getElementById('controlButtons1');
const wager1 = document.getElementById('wagerValue1')
const waitingLabel1 = document.getElementById('waitingLabel1');
const wagerButton1 = document.getElementById('wagerButton1');
const cancelButton1 = document.getElementById('cancelButton1');
const cashoutButton1 = document.getElementById('cashoutButton1');
const cashoutElem1 = document.getElementById('cashoutElem1');

const staked2 = false
const controlsBlock2 = document.getElementById('controlsBlock2');
const input2 = document.getElementById('wagerInput2')
const controlButtons2 = document.getElementById('controlButtons2');
const wager2 = document.getElementById('wagerValue2')
const waitingLabel2 = document.getElementById('waitingLabel2');
const wagerButton2 = document.getElementById('wagerButton2');
const cancelButton2 = document.getElementById('cancelButton2');
const cashoutButton2 = document.getElementById('cashoutButton2');

const pillars = document.getElementById('pillars');
// const wheel = document.getElementById('wheel');
const glow = document.getElementById('glow');
const multiplierContainer = document.getElementById('multiplierContainer');
const multiplierElem = document.getElementById('multiplier');
const flewAwayText = document.getElementById('flewAwayText');
const nextRoundLoading = document.getElementById('nextRoundLoading');
const nextRoundLoadingBar = document.getElementById('nextRoundLoadingBar');
const cashoutElem2 = document.getElementById('cashoutElem2');


const blocks = {
    1: {
        staked : false,
        wagerValue: 100,
        input: input1,
        wager: wager1,
        controlsBlock: controlsBlock1,
        controlButtons: controlButtons1,
        waitingLabel: waitingLabel1,
        wagerButton: wagerButton1,
        cancelButton: cancelButton1,
        cashoutButton: cashoutButton1,
        controlButtonStatus: 0, // wager
        cashoutElem: cashoutElem1
    },
    2: {
        staked : false,
        wagerValue: 2,
        input: input2,
        wager: wager2,
        controlsBlock: controlsBlock2,
        controlButtons: controlButtons2,
        waitingLabel: waitingLabel2,
        wagerButton: wagerButton2,
        cancelButton: cancelButton2,
        cashoutButton: cashoutButton2,
        controlButtonStatus: 0, // wager
        cashoutElem: cashoutElem2
    }
}

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
}

function playAudioSegment(start, stop, sounds) {

    // Set the starting point to 3 seconds
    sounds.currentTime = start;

    // Play the audio
    sounds.play();

    // Listen for time updates and stop when the audio reaches 6 seconds
    const stopPlayback = () => {
      if (sounds.currentTime >= stop) {
        sounds.pause(); // Stop the audio
        sounds.currentTime = 0; // Reset the time to the beginning or wherever you need
        sounds.removeEventListener('timeupdate', stopPlayback); // Remove the listener
      }
    };

    // Attach the event listener to track the audio time
    sounds.addEventListener('timeupdate', stopPlayback);
}

function parseNumber(numberString) {

    numberString = numberString.toString();
    const cleanedString = numberString.replace(/,/g, '');
    const parsedNumber = parseFloat(cleanedString);
    return isNaN(parsedNumber) ? null : parsedNumber;
}

function formatNumber(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        try {
            return Number(number).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        } catch (error) {
            
        }
    } else{
        return number.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
}

input1.addEventListener('input', () => {
    console.log('Yea');
    syncWager(1, input1.value);
})

input1.addEventListener('change', () => {
    input1.value = formatNumber(parseNumber(input1.value));
})

input2.addEventListener('input', () => {
    syncWager(2, input2.value);
})

input2.addEventListener('change', () => {
    input2.value = formatNumber(parseNumber(input2.value));
})

const setWager = (block, value) => {
    blocks[block].input.value = formatNumber(parseNumber(value));
    syncWager(block, blocks[block].input.value);
}

const syncWager = (block, value) => {
    console.log('Syncing Wager: ', value)
    blocks[block].wager.innerHTML = formatNumber(parseNumber(value));
    blocks[block].wagerValue = parseNumber(value);
} 

setWager(1, blocks[1].wagerValue);
setWager(2, blocks[2].wagerValue);

const increaseWager = (block) => {
    blocks[block].input.value = formatNumber(parseNumber(blocks[block].input.value) + 30);
    syncWager(block, formatNumber(blocks[block].input.value));
}

const decreaseWager = (block) => {
    if(parseNumber(blocks[block].input.value) <= 30){
        blocks[block].input.value = formatNumber(10);
    } else{
        blocks[block].input.value = formatNumber(parseNumber(blocks[block].input.value) - 30);
    }
    syncWager(block, formatNumber(blocks[block].input.value));
}

function setBalance(change){
    balance += change;
    balanceElem.innerHTML = balance.toFixed(2);
}

function updateCashout(block){
    blocks[block].cashoutElem.innerHTML = (blocks[block].wagerValue * multiplier).toFixed(2);
}

function updateCashouts(){
    updateCashout(1);
    updateCashout(2);
}



function playWheel(){
    wheel.style.animationPlayState = 'running';
}

function pauseWheel(){
    wheel.style.animationPlayState = 'paused';
}

function showGlow(){
    setGlowColor(glowColors[0]);
}

function hideGlow(){
    glow.style.boxShadow = '';
}

function setGlowColor(color){
    glow.style.boxShadow = `0 0 80px 60px ${color}`;
}

function showMultipier(){
    multiplierContainer.style.display = '';
}

function hideMultipier(){
    multiplierContainer.style.display = 'none';
}

function startMultipier(){
    multiplierElem.style.color = '';
    flewAwayText.style.display = '';
}

function stopMultipier(){
    multiplierElem.style.color = 'red';
    flewAwayText.style.display = 'block';
}

function showNextRoundLoading(){
    nextRoundLoading.style.display = 'flex';
    setTimeout(()=>{
        nextRoundLoadingBar.style.width = 0;
    }, 50)
}

function hideNextRoundLoading(){
    nextRoundLoading.style.display = '';
    nextRoundLoadingBar.style.width = '100%';
}

function hidePillars(){
    pillars.style.display = 'none';
}

function showPillars(){
    pillars.style.display = 'block';
}

function showWagerButton(block, delay = 0){
    blocks[block].controlButtonStatus = 0;
    blocks[block].controlsBlock.style.opacity = 0.5;
    setTimeout(()=>{
        blocks[block].controlsBlock.style.opacity = 1;
        blocks[block].controlsBlock.style.borderColor = '';
        blocks[block].wagerButton.style.display = 'flex';
        blocks[block].cancelButton.style.display = 'none';
        blocks[block].cashoutButton.style.display = 'none';
    }, delay)
}

function showCashoutButton(block){
    blocks[block].controlButtonStatus = 2;
    blocks[block].controlsBlock.style.opacity = 1;
    // blocks[block].controlsBlock.style.borderColor = '#f70';
    blocks[block].cashoutButton.style.display = 'flex';
    blocks[block].wagerButton.style.display = 'none';
    blocks[block].cancelButton.style.display = 'none';
}

function showCancelButton(block){
    blocks[block].controlButtonStatus = 1;
    // blocks[block].controlsBlock.style.borderColor = 'red';
    blocks[block].waitingLabel.style.display = 'block',
    blocks[block].cancelButton.style.display = 'flex';
    blocks[block].wagerButton.style.display = 'none';
    blocks[block].cashoutButton.style.display = 'none';

    if(gameStatus == 'waiting'){
        blocks[block].controlsBlock.style.opacity = 0.5;
    } else if(gameStatus == 'ready'){
        
        blocks[block].controlsBlock.style.opacity = 0.5;
        setTimeout(()=>{
            blocks[block].controlsBlock.style.opacity = 1;
            blocks[block].waitingLabel.style.display = 'none';
            setBalance(-blocks[block].wagerValue)
        }, 1500);
    }
    
    
    // setTimeout(()=>{
    //     blocks[block].controlsBlock.style.opacity = 0.5;
    //     blocks[block].waitingLabel.style.display = 'none';
    // }, 2200);
    
}

function dimBlock(block, opacity = 0.5){
    if(blocks[block].staked){
        blocks[block].waitingLabel.style.display = 'block';
    }
    blocks[block].controlsBlock.style.opacity = opacity;
}

function brightenBlock(block, opacity = 1){
    blocks[block].waitingLabel.style.display = 'none';
    blocks[block].controlsBlock.style.opacity = opacity;
}

function dimControls(){
    controls.style.opacity = 0.5;
}

function brightenControls(){
    controls.style.opacity = 1;
}

function dimBlocks(){
    for(let i = 1; i < 3; i++){
        if(blocks[i].staked){
            dimBlock(i);
        }
    }
}

function brightenBlocks(){
    for(let i = 1; i < 3; i++){
        if(blocks[i].staked){
            setBalance(-blocks[i].wagerValue)
        }
        brightenBlock(i);
    }
}

function revealCashouts(){
    for(let i = 1; i < 3; i++){
        if(blocks[i].staked){
            showCashoutButton(i);
        }
    }
}

function revealWagers(){
    for(let i = 1; i < 3; i++){
        if(blocks[i].controlButtonStatus == 2){
            showWagerButton(i);
        }
    }
}

function cleanStake(block){
    blocks[block].staked = false;
}

function cleanStakes(){
    for(let i = 1; i < 3; i++){
        if(blocks[i].staked && blocks[i].controlButtonStatus != 1 ){
            cleanStake(i);
        }
    }
}

function placeWager(block){
    playAudioSegment(0,1, sounds4);
    blocks[block].staked = true;
    showCancelButton(block);
}

function doCashout(block){
    playAudioSegment(0,1, sounds4);
    const delay = 800;
    blocks[block].staked = false;
    showWagerButton(block, delay);
    setTimeout(()=>{
        setBalance(multiplier.toFixed(2) * blocks[block].wagerValue);
        showToast(multiplier, multiplier.toFixed(2) * blocks[block].wagerValue);
        console.log("Cashout 2:", multiplier,)
        playAudioSegment(9,10, sounds3);
    }, delay)
    console.log("Cashout :", multiplier)
}

function doCancel(block){
    playAudioSegment(0,1, sounds4);
    blocks[block].staked = false;
    showWagerButton(block);
    blocks[block].waitingLabel.style.display = 'none';
}

function prependMultiplier(fresh = true, value){
    const elem = document.createElement('span');
    elem.className = `multiplier-history ${fresh && 'zoom-out'}`;
    const content = value || multiplier;
    elem.innerHTML = content.toFixed(2) + 'x';
    if(content < 2){
        elem.style.color = multiplierColors[0];
    } else if(content < 10){
        elem.style.color = multiplierColors[1];
    } else{
        elem.style.color = multiplierColors[2];
    }
    setTimeout(()=>{
        multiplierHistories.prepend(elem);
    }, fresh ? 2000 : 0)
}

function prefillMultipliersHistory(quantity){
    for(let i = 0; i < quantity; i++){
        const factor = Math.random() * 10;
        let value;
        if(factor < 4){
            prependMultiplier(false, 1 + Math.random());
        } else if(factor < 8){
            prependMultiplier(false, 2 + Math.random() * 5);
        } else{
            prependMultiplier(false, 10 + Math.random() * 30);
        }
    }
}

// prefillMultipliersHistory(20);


function showToast(odd, amount){

    toastContainer.style.display = 'flex';

    setTimeout(()=>{
        toastMultiplier.innerHTML = odd.toFixed(2) + 'x';
        toastAmount.innerHTML = amount.toFixed(2);
    
        toast.style.opacity = 1;
        toast.style.top = '0px';
    }, 50)

    setTimeout(()=>{
        toast.style.opacity = 0;
        toast.style.top = '-60px';
    }, 3000)
    
    setTimeout(()=>{
        toastContainer.style.display = 'none';
        toast.style.top = '80px';
    }, 3200)
}


function startRound(){
    showPillars();
    showMultipier();
    flyPlane();
    playWheel();
    showGlow();
    revealCashouts();
    gameStatus = 'flying';
    playAudioSegment(6.2,7.5, sounds1);
}

function endRound(){
    flyAway();
    stopMultipier();
    hidePillars();
    pauseWheel();
    setGlowColor('#0000');
    revealWagers();
    cleanStakes();
    prependMultiplier();
    pillars.className = 'pillars';
    gameStatus = 'flown';
    playAudioSegment(2,5, sounds2);
}

function cleanRound(){
    resetPlane();
    showNextRoundLoading();
    hideMultipier();
    startMultipier();
    setGlowColor(glowColors[0]);
    hideGlow();
    dimBlocks();
    gameStatus = 'waiting';
}

function hardReset(){
    // clearInterval(interval);
    resetPlane();
    multiplierHistories.innerHTML = '';
    prefillMultipliersHistory(20);
    index = 0;
    multiplier = 1; //multipliers[index];
    clearInterval(sequenceInterval);
    clearTimeout(nextTimeout);
    startButton.onclick = ()=>{startSequence(); startButton.onclick = null};
}
