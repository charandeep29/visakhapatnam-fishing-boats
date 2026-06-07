console.log("Boats Loaded:", boats);

// ==========================
// SEARCH BOAT
// ==========================

function searchBoat(){

    const boatNo =
        document.getElementById("boatNumber")
        .value
        .trim()
        .toUpperCase();

    const boat =
        boats.find(
            b => b.boatNumber.toUpperCase() === boatNo
        );

    const result =
        document.getElementById("result");

    if(boat){

        result.innerHTML = `

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
                <a href="https://www.google.com/maps?q=${boat.latitude},${boat.longitude}"
                   target="_blank">
                   View on Google Maps
                </a>
            </p>

            <p><b>Status:</b> ${boat.status}</p>

        </div>

        `;
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
// CLOCK
// ==========================

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
// SELECT BOAT
// ==========================

function selectBoat(boatNumber){

    document.getElementById("boatNumber").value =
        boatNumber;

    searchBoat();
}

// ==========================
// FILTER REGISTRY
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

        if(index===0) return;

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

function loadBoatRegistry(){

    const registry =
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

<button
onclick="deleteBoat('${boat.boatNumber}');event.stopPropagation();"
style="background:red;color:white;border:none;padding:5px 10px;border-radius:5px;">

Delete

</button>

</td>

</tr>

`;
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

        loadBoatRegistry();
        updateDashboard();
        loadReports();
        loadChart();

        alert("Boat Deleted Successfully");
    }
}

// ==========================
// CHART
// ==========================

function loadChart(){

    const chartCanvas =
        document.getElementById("boatChart");

    if(!chartCanvas){
        return;
    }

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

    if(window.boatChartInstance){
        window.boatChartInstance.destroy();
    }

    window.boatChartInstance = new Chart(chartCanvas, {

        type: "pie",

        data: {

            labels: [
                "At Sea",
                "Arriving Harbour",
                "Reached Harbour"
            ],

            datasets: [{

                data: [
                    atSea,
                    arriving,
                    reached
                ],

                backgroundColor: [
                    "#e53935",
                    "#ff9800",
                    "#00a651"
                ]
            }]
        }
    });
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

    loadBoatRegistry();
    updateDashboard();
    loadReports();
    loadChart();

    alert("Boat Added Successfully");
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

    loadChart();
};