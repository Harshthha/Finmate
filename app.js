// Use session persistence (logout when browser closes)
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

// ---------- AUTH STATE ----------
auth.onAuthStateChanged(user => {

  const loader = document.getElementById("loading");
  if (loader) loader.style.display = "none";

  const navbar = document.getElementById("mainNavbar");

  if (user) {
    console.log("Logged in:", user.email);

    document.getElementById("authSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";

    if (navbar) navbar.style.display = "flex";

    loadData();
    loadNotifications();
  } 
  else {
    console.log("User logged out");

    document.getElementById("authSection").style.display = "block";
    document.getElementById("appSection").style.display = "none";

    if (navbar) navbar.style.display = "none";
  }
});


// ---------- SIGNUP ----------
function signup(){
  auth.createUserWithEmailAndPassword(email.value, password.value)
  .then(()=>alert("Account Created Successfully"))
  .catch(e=>alert(e.message));
}


// ---------- LOGIN ----------
function login(){
  auth.signInWithEmailAndPassword(email.value, password.value)
  .catch(e=>alert(e.message));
}


// ---------- LOGOUT ----------
function logout(){
  auth.signOut();
}



// ---------- TOGGLE FORMS ----------
function toggleExpense(){
  document.getElementById("expenseForm").classList.toggle("d-none");
}

function toggleSub(){
  document.getElementById("subForm").classList.toggle("d-none");
}



// ---------- ADD EXPENSE ----------
function addExpense(){

  const user = auth.currentUser;
  if(!user) return alert("Not logged in");

  db.collection("users").doc(user.uid).collection("expenses").add({
    name: expName.value,
    amount: Number(expAmount.value),
    category: expCategory.value,
    type: expType.value
  })
  .then(()=>{
    expName.value = "";
    expAmount.value = "";
    expCategory.value = "Food";
    expType.value = "Need";
    loadData();
  })
  .catch(err=>{
    console.error(err);
    alert("Failed to save expense: " + err.message);
  });
}



// ---------- ADD SUBSCRIPTION ----------
function addSub(){

  const user = auth.currentUser;
  if(!user) return;

  db.collection("users").doc(user.uid).collection("subs").add({
    name: subName.value,
    amount: Number(subAmount.value),
    startDate: subStart.value,
    duration: Number(subDuration.value),
    subCategory: subCategory.value,
    type: subType.value
  })
  .then(()=>{
    subName.value = "";
    subAmount.value = "";
    subStart.value = "";
    subDuration.value = "";
    subCategory.value = "OTT";
    subType.value = "Need";
    loadData();
  })
  .catch(err=>{
    console.error(err);
    alert(err.message);
  });
}


// ---------- DELETE FUNCTIONS ----------
function deleteExpense(id){
  const user = auth.currentUser;
  if(!user) return;

  db.collection("users")
    .doc(user.uid)
    .collection("expenses")
    .doc(id)
    .delete()
    .then(loadData)
    .catch(err => console.error(err));
}

function deleteSub(id){
  const user = auth.currentUser;
  if(!user) return;

  db.collection("users")
    .doc(user.uid)
    .collection("subs")
    .doc(id)
    .delete()
    .then(loadData)
    .catch(err => console.error(err));
}



// ---------- MONTH KEY ----------
const monthKey = new Date().getFullYear() + "-" + (new Date().getMonth()+1);

// ---------- LOAD DATA ----------
async function loadData(){

  const user = auth.currentUser;
  if(!user) return;

  // ---------- LOAD MONTH SETTINGS ----------
  const settingsDoc = await db.collection("users")
    .doc(user.uid)
    .collection("settings")
    .doc(monthKey)
    .get();

  const budget = settingsDoc.exists ? settingsDoc.data().budget : 0;
  const targetSaving = settingsDoc.exists ? settingsDoc.data().saving : 0;

  let expenses = [];
  let subs = [];

  // Load expenses
  const expSnap = await db.collection("users")
  .doc(user.uid)
  .collection("expenses")
  .get();

expSnap.forEach(d => expenses.push({ id: d.id, ...d.data() }));


const subSnap = await db.collection("users")
  .doc(user.uid)
  .collection("subs")
  .get();

subSnap.forEach(d => subs.push({ id: d.id, ...d.data() }));



  // ---------- SUMMARY ----------
  const totalExpense = expenses.reduce((a,b)=>a + b.amount,0);
  document.getElementById("totalExpense").innerText = "₹" + totalExpense;

  const totalSub = subs.reduce((a,b)=>a + b.amount,0);
  const yearlyBurn = totalSub * 12;

  document.getElementById("totalSubs").innerText = "₹" + totalSub + " / month";
  console.log("Yearly subscription burn: ₹" + yearlyBurn);

  // ---------- REMAINING BALANCE ----------
  const totalSpent = totalExpense + totalSub;
  const remaining = budget - totalSpent;

  const remEl = document.getElementById("remainingMoney");
  if(remEl){
    remEl.innerText = "₹" + remaining;

    if(remaining < 0){
      remEl.style.color = "#ff4d6d"; // red
    }
    else if(remaining < budget * 0.2){
      remEl.style.color = "#facc15"; // yellow
    }
    else{
      remEl.style.color = "#4ade80"; // green
    }
  }

  // ---------- SMART ADVICE SECTION ----------
  let advice = "";
  if(budget === 0){
    advice = "⚠️ Set your monthly budget in Settings to get financial guidance.";
  }
  else if(remaining < 0){
    advice = "❌ You overspent this month. Try reducing wants and reviewing subscriptions.";
  }
  else if(remaining < budget * 0.2){
    advice = "😬 You are close to exhausting your budget. Slow down spending.";
  }
  else if(totalSub > budget * 0.4){
    advice = "📉 Subscriptions take a big chunk of your finances. Consider removing unused ones.";
  }
  else{
    advice = "🎉 You're managing money well this month. Keep it up!";
  }

  const adviceBox = document.getElementById("adviceText");
  if(adviceBox) adviceBox.innerText = advice;

  // ---------- NOTIFICATION TRIGGERS ----------

  // ---------- SMART NOTIFICATION TRIGGERS ----------

// 1️⃣ Budget 80% Warning
if(budget > 0 && totalSpent >= budget * 0.8){
  createNotificationOnce(
    "budget80",
    "⚠️ You have crossed 80% of your monthly budget!"
  );
}

// 2️⃣ Overspent Warning
if(budget > 0 && totalSpent > budget){
  createNotificationOnce(
    "overBudget",
    "❌ You overspent your budget this month. Slow down!"
  );
}

// 3️⃣ Savings Breach
if(budget > 0 && targetSaving > 0){
  const allowableSpend = budget - targetSaving;
  if(totalSpent > allowableSpend){
    createNotificationOnce(
      "savingsBreach",
      "🚨 You are now using your savings money!"
    );
  }
}

// 4️⃣ Subscription Renewals (Tomorrow)
subs.forEach(s=>{
  const next = getNextMonthlyRenewal(s.startDate);
  const days = daysLeft(next);

  if(days === 1){
    createNotificationOnce(
      "renewal-" + s.name,
      `📅 ${s.name} renews tomorrow`
    );
  }

  if(days === 0){
    createNotificationOnce(
      "renewalToday-" + s.name,
      `⚠️ ${s.name} renews today!`
    );
  }
});



  // ---------- UPCOMING RENEWALS ----------
  let upcoming = 0;

  subs.forEach(s=>{
    const next = getNextMonthlyRenewal(s.startDate);
    const days = daysLeft(next);
    if(days >= 0 && days <= 7){
      upcoming++;
      createNotificationOnce(
        `renewIn-${s.name}-${days}`,
        `📅 ${s.name} renews in ${days} days`
      );
    }
  });

  document.getElementById("renewalsCount").innerText = upcoming;



  // ---------- RENDER EXPENSE TABLE ----------
  expenseTable.innerHTML = expenses.map(e =>
  `<tr>
      <td>${e.name}</td>
      <td>₹${e.amount}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteExpense('${e.id}')">
          Delete
        </button>
      </td>
  </tr>`
).join("");



  // ---------- RENDER SUBS TABLE ----------
  subTable.innerHTML = subs.map(s => {

  const nextRenewal = getNextMonthlyRenewal(s.startDate);
  const expiry = getExpiryDate(s.startDate, s.duration);
  const remainingDays = daysLeft(nextRenewal);

  console.log(s.name, "→", remainingDays, "days");  // DEBUG

  let highlight = "";

  // expired
  if(new Date() > new Date(expiry)){
    highlight = "background:#e6e6e6 !important;color:#555;";
  }

  // within next 7 days
  else if(remainingDays >= 0 && remainingDays <= 7){
    highlight = "background:#ff0000 !important;color:white !important;font-weight:700;";
  }

  const cellStyle = `style="${highlight}"`;

return `
<tr>
  <td ${cellStyle}>${s.name}</td>
  <td ${cellStyle}>₹${s.amount}</td>
  <td ${cellStyle}>${nextRenewal}</td>
  <td ${cellStyle}>${remainingDays} days</td>
  <td ${cellStyle}>
      <button class="btn btn-sm btn-danger" onclick="deleteSub('${s.id}')">
        Delete
      </button>
  </td>
</tr>`;
}).join("");}



// ---------- HELPERS ----------
function daysLeft(date){
  return Math.ceil((new Date(date) - new Date())/(1000*60*60*24));
}

function getNextMonthlyRenewal(startDate){
  let start = new Date(startDate);
  let today = new Date();

  while(start <= today){
    start.setMonth(start.getMonth() + 1);
  }

  return start.toISOString().split("T")[0];
}

function getExpiryDate(startDate, durationMonths){
  let d = new Date(startDate);
  d.setMonth(d.getMonth() + durationMonths);
  return d.toISOString().split("T")[0];
}
async function loadNotifications(){
  const user = auth.currentUser;
  if(!user) return;

  const snap = await db.collection("users")
    .doc(user.uid)
    .collection("notifications")
    .orderBy("createdAt","desc")
    .get();

  let html = "";
  let count = 0;

  snap.forEach(d=>{
    count++;
    const n = d.data();

    html += `
      <div class="alert alert-light border d-flex justify-content-between align-items-center">
        <span>${n.message}</span>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteNotification('${d.id}')">
          ✕
        </button>
      </div>
    `;
  });

  notifList.innerHTML = html || `<p class='text-center text-muted'>No notifications 🎉</p>`;
  notifBadge.innerText = count;
  notifBadge.style.display = count ? "inline-block" : "none";
}
auth.onAuthStateChanged(user=>{
  if(user){
    loadData();
    loadNotifications();
  }
});
async function deleteNotification(id){
  const user = auth.currentUser;
  if(!user) return;

  await db.collection("users")
    .doc(user.uid)
    .collection("notifications")
    .doc(id)
    .delete();

  loadNotifications();
}

function getTodayKey(){
  return new Date().toISOString().split("T")[0];
}

// Create notification only once per day per type
async function createNotificationOnce(type, message){
  const user = auth.currentUser;
  if(!user) return;

  const today = getTodayKey();
  const notifId = `${type}_${today}`;   // 🔥 Fixed ID

  await db.collection("users")
    .doc(user.uid)
    .collection("notifications")
    .doc(notifId)
    .set({
      type,
      message,
      dateKey: today,
      createdAt: new Date()
    }, { merge: true });   // 🔥 overwrite instead of duplicate

  loadNotifications();
}