let isAdmin = false;

// ==========================
// SEARCH BOAT
// ==========================

function searchBoat(){

    const searchText =
        document.getElementById("boatNumber")
        .value
        .trim()
        .toUpperCase();

    const matchedBoats = boats.filter(b =>

    (b.boatNumber || "").toUpperCase().includes(searchText) ||

    (b.boatName || "").toUpperCase().includes(searchText) ||

    (b.owner || "").toUpperCase().includes(searchText) ||

    (b.mobile || "").includes(searchText)

);

    const result =
        document.getElementById("result");

    if(matchedBoats.length > 0){

        let html = "";

        matchedBoats.forEach(boat => {

            html += `

            <div class="result-card">

                <h2>⚓ Boat Details</h2>

                <p><b>Boat Number:</b> ${boat.boatNumber}</p>
                <p><b>Boat Name:</b> ${boat.boatName}</p>
                <p><b>Owner:</b> ${boat.owner}</p>
                <p><b>Harbour:</b> ${boat.harbour}</p>
                <p><b>Crew Members:</b> ${boat.crew}</p>

<p><b>Mobile Number:</b> ${boat.mobile}</p>

<p><b>Tracker ID:</b> ${boat.trackerId}</p>

<p><b>Latitude:</b> ${boat.latitude}</p>

<p><b>Longitude:</b> ${boat.longitude}</p>

<p>
<b>GPS Location:</b>

<a
href="https://www.google.com/maps?q=${boat.latitude},${boat.longitude}"
target="_blank">

📍 View on Google Maps

</a>

</p>

<p><b>Status:</b> ${boat.status}</p>
            </div>

            <br>

            `;
        });

        result.innerHTML = html;
    }
    else{

        result.innerHTML = `

        <div class="result-card">

            <h2>❌ Boat Not Found</h2>

            <p>Please enter a valid boat number.</p>

        </div>

        `;
    }
}
// ==========================
// SELECT BOAT
// ==========================

function selectBoat(boatNumber){

    document.getElementById("boatNumber").value =
        boatNumber;

    searchBoat();

    document.getElementById("result")
        .scrollIntoView({
            behavior:"smooth"
        });
}

// ==========================
// REGISTRY SEARCH
// ==========================

function filterRegistry(){

    const input =
        document.getElementById("registrySearch")
        .value
        .toUpperCase();

    const rows =
        document.querySelectorAll(
            "#boatRegistry table tr"
        );

    rows.forEach((row,index)=>{

        if(index === 0){
            return;
        }

        const text =
            row.innerText.toUpperCase();

        row.style.display =
            text.includes(input)
            ? ""
            : "none";
    });
}

// ==========================
// DASHBOARD
// ==========================

function updateDashboard(){

    document.getElementById("totalBoats").innerHTML =
        boats.length;

    document.getElementById("atSea").innerHTML =
        boats.filter(
            boat => boat.status === "At Sea"
        ).length;

    document.getElementById("arriving").innerHTML =
        boats.filter(
            boat => boat.status === "Arriving Harbour"
        ).length;

    document.getElementById("reached").innerHTML =
        boats.filter(
            boat => boat.status === "Reached Harbour"
        ).length;

    document.getElementById("sosCount").innerHTML =
        boats.filter(
            boat => boat.status === "EMERGENCY SOS"
        ).length;
}// ==========================
// DELETE BOAT
// ==========================

function saveBoats(){

    localStorage.setItem(
        "boats",
        JSON.stringify(boats)
    );
}

async function addBoatPrompt(){

    const boatNumber =
        prompt("Enter Boat Number");

    const boatName =
        prompt("Enter Boat Name");

    const owner =
        prompt("Enter Owner Name");

    const mobile =
        prompt("Enter Mobile Number");

    try{

        await window.addDoc(
    window.collection(window.db, "boats"),
            {
                boatNumber: boatNumber,
                boatName: boatName,
                owner: owner,
                mobile: mobile,

                harbour:
                "Visakhapatnam Mechanized Fishing Boats Harbour",

                crew: "0",

                trackerId:
                "GPS" + Date.now(),

                latitude: "17.6868",

                longitude: "83.2185",

                status: "Reached Harbour"
            }
        );

        await loadFirebaseBoats();

        openSuccessPopup(
            "🚤 Boat Added",
            "Boat Saved To Firestore Successfully"
        );

    } catch(error){

        console.error(error);

        alert("Failed To Save Boat");
    }
}

// ==========================
// PAGE LOAD
// ==========================

window.onload = function(){

    if(typeof loadWeather === "function"){
        loadWeather();
    }

    if(typeof updateClock === "function"){

        updateClock();

        setInterval(updateClock,1000);

    }

    loadFirebaseBoats();

    setInterval(() => {

        loadFirebaseBoats();

    }, 5000);
};
function adminLogin(){

    const username =
        prompt("Enter Username");

    const password =
        prompt("Enter Password");

    if(
        username === "admin" &&
        password === "harbour123"
    ){

       isAdmin = true;

const addBtn =
    document.getElementById("addBoatBtn");

if(addBtn){
    addBtn.style.display = "inline-block";
}
document.getElementById("downloadBtn").style.display =
    "inline-block";

document.getElementById("csvFile").style.display =
    "inline-block";
document.getElementById("logoutBtn").style.display =
    "inline-block";

loadBoatRegistry();

openSuccessPopup(
    "✅ Login Successful",
    "Welcome Administrator"
);
    }
    else{

        alert("Invalid Username or Password");
    }
}
function adminLogout(){

    isAdmin = false;

    document.getElementById("addBoatBtn").style.display =
        "none";

    document.getElementById("logoutBtn").style.display =
        "none";

    loadBoatRegistry();

    openSuccessPopup(
    "👋 Logged Out",
    "You have been logged out successfully"
);
document.getElementById("downloadBtn").style.display =
    "none";

document.getElementById("csvFile").style.display =
    "none";
}
// ==========================
// DOWNLOAD CSV
// ==========================

function downloadCSV(){

    let csv =
        "Boat Number,Boat Name,Owner,Mobile,Status\n";

    boats.forEach(boat => {

        csv +=
            `${boat.boatNumber},` +
            `${boat.boatName},` +
            `${boat.owner},` +
            `${boat.mobile},` +
            `${boat.status}\n`;

    });

    const blob =
        new Blob([csv], {type:"text/csv"});

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "BoatRegistry.csv";

    link.click();
}
// ==========================
// IMPORT CSV
// ==========================

function importCSV(event){

    const file =
        event.target.files[0];

    if(!file){
        return;
    }

    const reader =
        new FileReader();

    reader.onload = function(e){

        const text =
            e.target.result;

        const rows =
            text.split("\n");

        rows.shift(); // Remove header

        rows.forEach(row => {

            const cols =
                row.split(",");

            if(cols.length >= 5){

                boats.push({

                    boatNumber: cols[0].trim(),
                    boatName: cols[1].trim(),
                    owner: cols[2].trim(),
                    mobile: cols[3].trim(),

                    status: cols[4].trim(),

                    harbour:
                    "Visakhapatnam Mechanized Fishing Boats Harbour",

                    crew: "0",

                    trackerId:
                    "GPS" + (boats.length + 1),

                    latitude: "17.6868",

                    longitude: "83.2185"
                });
            }
        });

        saveBoats();

        loadBoatRegistry();

        updateDashboard();

        loadReports();

        openSuccessPopup(
    "📂 Import Successful",
    "Boat Registry Imported Successfully"
);
    };

    reader.readAsText(file);
}
function openLogin(){

    document.getElementById("loginModal")
        .style.display = "block";
}

function closeLogin(){

    document.getElementById("loginModal")
        .style.display = "none";
}
function checkLogin(){

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    if(
        username === "admin" &&
        password === "harbour123"
    ){

        isAdmin = true;

        closeLogin();

        const addBtn =
            document.getElementById("addBoatBtn");

        if(addBtn){
            addBtn.style.display = "inline-block";
        }

        document.getElementById("downloadBtn").style.display =
            "inline-block";

        document.getElementById("csvFile").style.display =
            "inline-block";

        document.getElementById("logoutBtn").style.display =
            "inline-block";

        loadBoatRegistry();

        openSuccessPopup(
    "✅ Login Successful",
    "Welcome Administrator"
);
    }
    else{

        alert("Invalid Username or Password");
    }
}
function openSuccessPopup(title,text){

    document.getElementById("successTitle")
        .innerHTML = title;

    document.getElementById("successText")
        .innerHTML = text;

    document.getElementById("successPopup")
        .style.display = "block";
}

function closeSuccessPopup(){

    document.getElementById("successPopup")
        .style.display = "none";
}
function updateClock(){

    const clock = document.getElementById("clock");

    if(!clock) return;

    const now = new Date();

    clock.innerHTML =
        now.toLocaleDateString("en-IN") +
        " | " +
        now.toLocaleTimeString("en-IN");
}
window.updateDashboard = updateDashboard;
function loadBoatRegistry(){

    const registry =
    document.getElementById("boatRegistry");

    if(!registry) return;

    let html = `

    <div class="registry-overview">

        <div class="overview-card">
            🚢 Total Boats : ${boats.length}
        </div>

        <div class="overview-card">
            🌊 At Sea : ${
                boats.filter(
                boat => boat.status === "At Sea"
                ).length
            }
        </div>

        <div class="overview-card">
            ⚓ Harbour : ${
                boats.filter(
                boat => boat.status === "Reached Harbour"
                ).length
            }
        </div>

    </div>

    <table class="registry-table">

        <tr>

            <th>Boat Number</th>
            <th>Boat Name</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Action</th>

        </tr>

    `;

    boats.forEach(boat => {

        let statusBadge = "";

        if(boat.status === "EMERGENCY SOS"){

            statusBadge =
            `<span class="status-red">
            🚨 SOS Alert
            </span>`;

        }
        else if(boat.status === "At Sea"){

            statusBadge =
            `<span class="status-orange">
            🌊 At Sea
            </span>`;

        }
        else if(boat.status === "Arriving Harbour"){

            statusBadge =
            `<span class="status-orange">
            🧭 Arriving Harbour
            </span>`;

        }
        else{

            statusBadge =
            `<span class="status-green">
            ⚓ Reached Harbour
            </span>`;
        }

        html += `

        <tr>

            <td>${boat.boatNumber}</td>

            <td>${boat.boatName}</td>

            <td>${boat.owner}</td>

            <td>${statusBadge}</td>

            <td>

                <button
                class="view-btn"
                onclick="selectBoat('${boat.boatNumber}')">

                👁 View

                </button>

            </td>

        </tr>

        `;
    });

    html += `</table>`;

    registry.innerHTML = html;
}
window.loadBoatRegistry = loadBoatRegistry;
window.loadReports = loadReports;
window.updateClock = updateClock;

async function loadFirebaseBoats() {

    try {

        const querySnapshot =
            await window.getDocs(
                window.collection(
                    window.db,
                    "boats"
                )
            );

        boats.length = 0;

        querySnapshot.forEach((doc) => {

            boats.push({
                id: doc.id,
                ...doc.data()
            });

        });

        console.log("Boats Loaded:", boats);

        loadBoatRegistry();
        updateDashboard();

loadSOSHistory();

loadReports();
    } catch(error) {

        console.error(error);

    }
}
// ==========================
// SOS ALERT HISTORY
// ==========================

function loadSOSHistory(){

    const sosBoats =
    boats.filter(
        boat => boat.status === "EMERGENCY SOS"
    );

    if(sosBoats.length === 0){

        document.getElementById(
        "sosTable"
        ).innerHTML =
        "<h3 style='color:green;'>✅ No Active SOS Alerts</h3>";

        return;
    }

    let html = `

    <table>

        <tr>
            <th>Boat Number</th>
            <th>Boat Name</th>
            <th>Owner</th>
            <th>Status</th>
        </tr>

    `;

    sosBoats.forEach(boat => {

        html += `

        <tr>
            <td>${boat.boatNumber}</td>
            <td>${boat.boatName}</td>
            <td>${boat.owner}</td>

            <td style="color:red;font-weight:bold;">
                🚨 EMERGENCY SOS
            </td>

        </tr>

        `;

    });

    html += `</table>`;

    document.getElementById(
    "sosTable"
    ).innerHTML = html;
}
// ==========================
// WEATHER PANEL
// ==========================

async function loadWeather(){

const apiKey =
"bd624515b95decbaaa93805687a56374";
const city =
"Visakhapatnam";

try{

const response =
await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
);

const data =
await response.json();

if(data.cod != 200){

throw new Error(data.message);

}

let status = "🟢 SAFE";
let color = "green";

if(data.wind.speed > 10){

status = "🟡 CAUTION";
color = "orange";

}

if(data.wind.speed > 20){

status = "🔴 DANGER";
color = "red";

}

document.getElementById(
"weatherPanel"
).innerHTML = `

<div class="weather-card">

<h3>
🌡 Temperature :
${data.main.temp}°C
</h3>

<h3>
💨 Wind Speed :
${data.wind.speed} m/s
</h3>

<h3>
☁ Condition :
${data.weather[0].main}
</h3>

<h3 style="color:${color};">
${status}
</h3>

</div>

`;

}
catch(error){

document.getElementById(
"weatherPanel"
).innerHTML = `

<div class="weather-card">

<h3 style="color:red;">
Weather Service Unavailable
</h3>

<p>${error.message}</p>

</div>

`;

}
}
