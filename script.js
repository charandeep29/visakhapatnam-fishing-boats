let isAdmin = false;
if(localStorage.getItem("boats")){

    boats.splice(
        0,
        boats.length,
        ...JSON.parse(
            localStorage.getItem("boats")
        )
    );
}
console.log("Boats Loaded:", boats);

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
// BOAT REGISTRY
// ==========================

function loadBoatRegistry(){    const registry =
        document.getElementById("boatRegistry");

    let html = `

<table border="1" width="100%" cellpadding="10">

<tr>
    <th>Boat Number</th>
    <th>Boat Name</th>
    <th>Owner</th>
    <th>Status</th>
    <th>Action</th>
</tr>

`;

    boats.forEach(boat => {

        html += `

<tr
onclick="selectBoat('${boat.boatNumber}')"
style="cursor:pointer;">

<td>${boat.boatNumber}</td>

<td>${boat.boatName}</td>

<td>${boat.owner}</td>

<td>

<span class="${
    boat.status === "At Sea"
    ? "red"
    : boat.status === "Arriving Harbour"
    ? "orange"
    : "green"
}">
${boat.status}
</span>

</td>

<td>

${isAdmin ? `

<button
onclick="editBoat('${boat.boatNumber}');event.stopPropagation();"
style="background:orange;color:white;border:none;padding:5px 10px;border-radius:5px;margin-right:5px;">

Edit

</button>

<button
onclick="deleteBoat('${boat.boatNumber}');event.stopPropagation();"
style="background:red;color:white;border:none;padding:5px 10px;border-radius:5px;">

Delete

</button>

` : "Viewer"}

</td>`;
    });

    html += `</table>`;

    registry.innerHTML = html;
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
}

// ==========================
// REPORTS
// ==========================

function loadReports(){

    const report =
        document.getElementById("reportSection");

    if(!report){
        return;
    }
    const total = boats.length;

    const atSea =
        boats.filter(
            boat => boat.status === "At Sea"
        ).length;

    const arriving =
        boats.filter(
            boat => boat.status === "Arriving Harbour"
        ).length;

    const reached =
        boats.filter(
            boat => boat.status === "Reached Harbour"
        ).length;

    report.innerHTML = `

<h3>Total Registered Boats : ${total}</h3>

<h3>🌊 At Sea : ${atSea}</h3>

<h3>🟠 Arriving Harbour : ${arriving}</h3>

<h3>⚓ Reached Harbour : ${reached}</h3>

`;
}

// ==========================
// DELETE BOAT
// ==========================

function deleteBoat(boatNumber){

    const confirmDelete =
        confirm("Delete " + boatNumber + " ?");

    if(!confirmDelete){
        return;
    }

    const index =
        boats.findIndex(
            boat => boat.boatNumber === boatNumber
        );

    if(index !== -1){

        boats.splice(index,1);
        saveBoats();
        loadBoatRegistry();
        updateDashboard();
        loadReports();
        

        openSuccessPopup(
    "🗑️ Boat Deleted",
    "Boat Removed Successfully"
);
    }
}

// ==========================
// ADD BOAT
// ==========================

function addBoatPrompt(){

    const boatNumber =
        prompt("Enter Boat Number");

    const boatName =
        prompt("Enter Boat Name");

    const owner =
        prompt("Enter Owner Name");

    const mobile =
        prompt("Enter Mobile Number");

    boats.push({

        boatNumber: boatNumber,
        boatName: boatName,
        owner: owner,
        mobile: mobile,

        harbour:
        "Visakhapatnam Mechanized Fishing Boats Harbour",

        crew: "0",

        trackerId:
        "GPS" + (boats.length + 1),

        latitude: "17.6868",

        longitude: "83.2185",

        status: "Reached Harbour"
    });
    saveBoats();
    loadBoatRegistry();
    updateDashboard();
    loadReports();

    openSuccessPopup(
    "🚤 Boat Added",
    "New Boat Registered Successfully"
);
}
function saveBoats(){

    localStorage.setItem(
        "boats",
        JSON.stringify(boats)
    );
}
function updateClock(){

    const clock =
        document.getElementById("clock");

    if(clock){

        const now = new Date();

        clock.innerHTML =
            now.toLocaleDateString("en-IN") +
            " | " +
            now.toLocaleTimeString("en-IN");
    }
}
// ==========================
// PAGE LOAD
// ==========================

window.onload = function(){

    updateClock();

    setInterval(updateClock,1000);

loadBoatRegistry();

updateDashboard();

loadReports();
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
function editBoat(boatNumber){

    const boat =
    boats.find(
        boat => boat.boatNumber === boatNumber
    );

    if(!boat){
        return;
    }

    const newBoatNumber =
        prompt(
            "Enter Boat Number",
            boat.boatNumber
        );

    const newBoatName =
        prompt(
            "Enter Boat Name",
            boat.boatName
        );

    const newOwner =
        prompt(
            "Enter Owner Name",
            boat.owner
        );

    const newMobile =
        prompt(
            "Enter Mobile Number",
            boat.mobile
        );

    const newStatus =
        prompt(
            "Enter Status (At Sea / Arriving Harbour / Reached Harbour)",
            boat.status
        );

    if(newBoatNumber){
        boat.boatNumber = newBoatNumber;
    }

    if(newBoatName){
        boat.boatName = newBoatName;
    }

    if(newOwner){
        boat.owner = newOwner;
    }

    if(newMobile){
        boat.mobile = newMobile;
    }

    if(newStatus){
        boat.status = newStatus;
    }
    saveBoats();

    loadBoatRegistry();

    updateDashboard();

    loadReports();

    openSuccessPopup(
    "✏️ Boat Updated",
    "Boat Information Updated Successfully"
);
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