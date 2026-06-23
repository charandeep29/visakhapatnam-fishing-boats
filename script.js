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

    const boat =
    boats.find(
        b => b.boatNumber === boatNumber
    );

    if(!boat) return;

    document.getElementById("boatModalBody").innerHTML = `

<p><b>Boat Number :</b> ${boat.boatNumber}</p>

<p><b>Boat Name :</b> ${boat.boatName}</p>

<p><b>Owner :</b> ${boat.owner}</p>

<p><b>Mobile :</b> ${boat.mobile}</p>

<p><b>Status :</b> ${boat.status}</p>

        <a
        class="map-link"
        target="_blank"
        href="https://www.google.com/maps?q=${boat.latitude},${boat.longitude}">
        📍 Open GPS Location
        </a>

    `;

    document.getElementById(
        "boatModal"
    ).style.display = "block";
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

    document.getElementById("reached").innerHTML =
        boats.filter(
            boat => boat.status === "Reached Harbour"
        ).length;

    document.getElementById("sosCount").innerHTML =
        boats.filter(
            boat => boat.status === "EMERGENCY SOS"
        ).length;
if(sosBoats.length > 0){

    showSOSPopup(sosBoats[0]);

}
document.getElementById("boatsDeparted").innerHTML =
boats.filter(
boat => boat.status === "At Sea"
).length;

document.getElementById("boatsArrived").innerHTML =
boats.filter(
boat => boat.status === "Reached Harbour"
).length;

document.getElementById("activeSOS").innerHTML =
boats.filter(
boat => boat.status === "EMERGENCY SOS"
).length;
}
function closeBoatModal(){

    document.getElementById(
    "boatModal"
    ).style.display = "none";

}
// ==========================
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
document.getElementById("reportBtn").style.display = "inline-block";

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
document.getElementById("reportBtn").style.display =
    "none";

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
}window.loadBoatRegistry = loadBoatRegistry;
window.updateClock = updateClock;
window.selectBoat = selectBoat;
window.closeBoatModal = closeBoatModal;

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
console.log("Total Boats =", boats.length);

        console.log("Boats Loaded:", boats);

        loadBoatRegistry();
        updateDashboard();

loadSOSHistory();
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
if(sosBoats.length > 0){

    showSOSPopup(sosBoats[0]);

}
if(sosBoats.length > 0){

    showSOSPopup(
        sosBoats[0]
    );

}
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
const weatherBanner =
document.getElementById("weatherBanner");

if(data.wind.speed >= 20){

    weatherBanner.style.display = "block";

    weatherBanner.innerHTML =
    "🚨 WEATHER ALERT - Strong Winds Detected. Return To Harbour Immediately";

}
else if(data.wind.speed >= 10){

    weatherBanner.style.display = "block";

    weatherBanner.innerHTML =
    "🟠 WEATHER WARNING - Proceed With Caution";

}
else{

    weatherBanner.style.display = "none";

}

if(data.cod != 200){

throw new Error(data.message);

}

let status = "";
let color = "";
let message = "";

if(data.wind.speed < 10){

    status = "🟢 SAFE FOR FISHING";
    color = "green";
    message = "Current sea conditions are safe.";

}
else if(data.wind.speed < 20){

    status = "🟠 WEATHER WARNING";
    color = "orange";
    message = "Strong winds expected. Proceed with caution.";

}
else{

    status = "🚨 RETURN TO HARBOUR IMMEDIATELY";
    color = "red";
    message = "Dangerous sea conditions detected.";

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

<p style="font-size:18px;">
${message}
</p>

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
function updateWeatherAlert(windSpeed){

    const alertBox =
    document.getElementById("weatherAlert");

    if(windSpeed < 10){

        alertBox.className =
        "weather-alert safe";

        alertBox.innerHTML =
        "🟢 SAFE FOR FISHING";

    }

    else if(windSpeed < 20){

        alertBox.className =
        "weather-alert warning";

        alertBox.innerHTML =
        "🟠 WEATHER WARNING<br>Strong Winds Expected";

    }

    else{

        alertBox.className =
        "weather-alert danger";

        alertBox.innerHTML =
        `🚨 WEATHER ALERT

Strong Winds Detected

Return to Visakhapatnam Harbour Immediately
or move to the nearest Safe Zone`;


    }
}
function filterRegistry() {

    let input =
    document.getElementById("registrySearch")
    .value.toLowerCase();

    let rows =
    document.querySelectorAll(
    "#boatRegistry table tr"
    );

    rows.forEach((row,index) => {

        if(index === 0) return;

        let text =
        row.innerText.toLowerCase();

        row.style.display =
        text.includes(input)
        ? ""
        : "none";

    });
}
function showSOSPopup(boat){

    document.getElementById("sosMessage").innerHTML = `

        <b>Boat Number:</b> ${boat.boatNumber}<br><br>

        <b>Boat Name:</b> ${boat.boatName}<br><br>

        <b>Owner:</b> ${boat.owner}<br><br>

        <b>Status:</b> 🚨 EMERGENCY SOS

    `;

    document.getElementById("sosPopup").style.display = "block";
}

function closeSOSPopup(){

    document.getElementById("sosPopup").style.display = "none";

}
function downloadReport(){

    const report = `

VISAKHAPATNAM MECHANIZED FISHING BOATS

Date: ${new Date().toLocaleDateString()}

Total Boats : ${boats.length}

At Sea : ${
boats.filter(
boat => boat.status === "At Sea"
).length
}

In Harbour : ${
boats.filter(
boat => boat.status === "Reached Harbour"
).length
}

SOS Alerts : ${
boats.filter(
boat => boat.status === "EMERGENCY SOS"
).length
}

Weather Status :
SAFE FOR FISHING

Department of Fisheries
Andhra Pradesh

`;

    const blob =
    new Blob(
        [report],
        {type:"text/plain"}
    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "Harbour_Report.txt";

    link.click();
}
// ==========================
// LIVE HARBOUR MAP
// ==========================

window.addEventListener("load", function(){

    const mapContainer =
    document.getElementById("mapContainer");

    if(!mapContainer) return;

    const map = L.map("mapContainer")
    .setView([17.6500,83.3500],11);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:"© OpenStreetMap"
        }
    ).addTo(map);

    // Harbour Zone

 L.circle(
    [17.6850,83.2850],
    {
        color:'green',
        fillColor:'#00ff00',
        fillOpacity:0.20,
        radius:1500
    }
)
.addTo(map)
.bindPopup("⚓ Visakhapatnam Fishing Harbour");
const boatIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3063/3063188.png",
    iconSize: [40,40],

    iconAnchor: [20,20],

    popupAnchor: [0,-15]
});

    // Boats

L.marker([17.6550,83.3400],{icon:boatIcon})
.addTo(map)
.bindPopup(`
<b>🚢 INDAPV001</b><br>
Owner : Ramesh<br>
Status : At Sea
`);

L.marker([17.6350,83.3700],{icon:boatIcon})
.addTo(map)
.bindPopup(`
<b>🚢 INDAPV002</b><br>
Owner : Suresh<br>
Status : At Sea
`);

L.marker([17.6150,83.4000],{icon:boatIcon})
.addTo(map)
.bindPopup(`
<b>🚢 INDAPV003</b><br>
Owner : Ravi<br>
Status : At Sea
`);

L.marker([17.5950,83.4400],{icon:boatIcon})
.addTo(map)
.bindPopup(`
<b>🚢 INDAPV004</b><br>
Owner : Ganesh<br>
Status : At Sea
`);

L.marker([17.5750,83.4800],{icon:boatIcon})
.addTo(map)
.bindPopup(`
<b>🚢 INDAPV005</b><br>
Owner : Sai<br>
Status : At Sea
`);
}); 