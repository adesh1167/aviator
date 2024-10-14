// Your web app's Firebase configuration
// Replace the below config object with your own Firebase project config
  const firebaseConfig = {
    apiKey: "AIzaSyCUq3soYcHXrdjA9jPi8td-ZYxdwFcEjeE",
    authDomain: "starvibe2.firebaseapp.com",
    databaseURL: "https://starvibe2-default-rtdb.firebaseio.com",
    projectId: "starvibe2",
    storageBucket: "starvibe2.appspot.com",
    messagingSenderId: "490906963366",
    appId: "1:490906963366:web:e382bebe74349d807f5367"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Realtime Database and get a reference to the service
  const database = firebase.database();

  let liveMutipliers;

  let firstLoad = true;

  const addr = window.location.search;
  const urlParams = new URLSearchParams(addr);
  const user = urlParams.get('user');

  const liveMutipliersRef = database.ref('multipliers');
  const balanceRef = database.ref(`balance/${user}`);

  async function initBalance(){
    const snapshot = await balanceRef.once('value');
    if(snapshot.exists()){
        balance = parseFloat(snapshot.val());
    } else {
        await balanceRef.set(20431.58);
        balance = 20431.58;
    }
    setBalance(0);
  }

  initBalance();

  function generalStart(){    
      liveMutipliersRef.on('value', (snapshot) => {
        const data = snapshot.val();
        liveMutipliers = Object.values(data);
        if(firstLoad){
            for(const multiplier of [...liveMutipliers].slice(0, liveMutipliers.length - 4)){
                prependMultiplier(false, multiplier)
            }
            index = liveMutipliers.length - 4;
            firstLoad = false;
        }
        multipliers = liveMutipliers
        console.log("Live Multipliers: ", liveMutipliers, multipliers);
    });
    
    const startedRef = database.ref(`started/${user}`);
    
    async function liveStart(){
        await startedRef.set(true);
        startSequence();
    }
    
    liveStart();
  }

