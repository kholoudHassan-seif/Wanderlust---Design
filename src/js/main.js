const countrySelect = document.getElementById("global-country");
const citySelect = document.getElementById("global-city");
const yearSelect = document.getElementById("global-year");
const exploreBtn = document.getElementById("global-search-btn") || document.querySelector(".search-btn-group button");
const holidays_tab =document.getElementById("holidays-tab");
const longweeksend_tab = document.getElementById("longweeksend-tab");
const events_tab = document.getElementById("events-tab");
async function getCountries() {
    try {
        const req = await fetch(`https://date.nager.at/api/v3/AvailableCountries`);
        const countries = await req.json();

        let optionsHtml = '<option value="">Select Country</option>';
        countries.forEach(country => {
            optionsHtml += `<option value="${country.countryCode}">${country.name}</option>`;
        });

        countrySelect.innerHTML = optionsHtml;
    } catch (error) {
        console.error("Error loading countries:", error);
    }
}

getCountries();
countrySelect.addEventListener("change", async function () {
    const countryCode = countrySelect.value;
    const countryName = countrySelect.options[countrySelect.selectedIndex].text;
    try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: countryName })
        });
        const data = await res.json();

        if (!data.error && data.data && data.data.length > 0) {
            let citiesHtml = '<option value="">Select City</option>';
            data.data.forEach(city => {
                citiesHtml += `<option value="${city}">${city}</option>`;
            });
            citySelect.innerHTML = citiesHtml;
        } else {
            citySelect.innerHTML = '<option value="">No cities available</option>';
        }
    } catch (error) {
        citySelect.innerHTML = '<option value="">Error loading cities</option>';
    }
});


////////Holidayes////////////
let holidaysList=[];
async function Holidayes() {
const countrycode= countrySelect.value;
let year = yearSelect.value;
    try {
        const req = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countrycode}`);
        holidaysList = await req.json();
        console.log(holidaysList);
        showholidays();
    } catch (error) {      }
}
function showholidays() {
    let box = "";
        for (let i = 0; i < holidaysList.length; i++) {
        const dateObj = new Date(holidaysList[i].date);
        const day = dateObj.getDate(); 
        const month = dateObj.toLocaleString('en-US', { month: 'short' }); 
        const weekday = dateObj.toLocaleString('en-US', { weekday: 'long' }); 

        const holidayType = holidaysList[i].types ? holidaysList[i].types[0] : 'Public';

        box += `
        <div class="holiday-card">
            <div class="holiday-card-header">
                <div class="holiday-date-box">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
                <button class="holiday-action-btn"><i class="fa-regular fa-heart"></i></button>
            </div>
            <h3>${holidaysList[i].localName}</h3>
            <p class="holiday-name">${holidaysList[i].name}</p>
            <div class="holiday-card-footer">
                <span class="holiday-day-badge"><i class="fa-regular fa-calendar"></i> ${weekday}</span>
                <span class="holiday-type-badge">${holidayType}</span>
            </div>
        </div>
        `;
    }
    document.getElementById("holidays-content").innerHTML = box;
}
Holidayes();
holidays_tab.addEventListener("change", function() {
    Holidayes(); 
});

yearSelect.addEventListener("change", function() {
    Holidayes(); 
});
const sideBarLinks = document.querySelectorAll(".sidebar-nav .nav-item");
const mainView = document.querySelectorAll("#main-content .view");

sideBarLinks.forEach(function (button) {
    button.addEventListener("click", function (e) {
        e.preventDefault();
        mainView.forEach(function (section) {
            section.classList.remove("active");
        });
        const viewId = this.getAttribute("data-view");
        if (viewId) {
            const target = document.getElementById(viewId);

            if (target) {
                let viewName = viewId.replace("-view", "");
                history.pushState(null, "", `#${viewName}`);
                target.classList.add("active");
                if (typeof sidebar !== 'undefined' && sidebar) {
                    sidebar.classList.remove("open");
                }
                if (viewId === "holidays-view") {
                    Holidayes();
                } else if (viewId === "long-weekends-view") {
                    console.log("jjjjj");
                    getLongWeekends(); 
                }else if(viewId === "events-view")
                {
                    console.log("llllllll");
                    getevents();
                }
            }
        }
    });
});

///////////longweekend////////////

let longweekendList = [];
async function getLongWeekends() {

    const countrySelect = document.getElementById("global-country");
    const yearSelect = document.getElementById("global-year");
    
    if (!countrySelect || !yearSelect) return;

    const countrycode = countrySelect.value;
    let year = yearSelect.value;
    try {
        const req = await fetch(`https://date.nager.at/api/v3/LongWeekend/${year}/${countrycode}`);
        longweekendList = await req.json();
        console.log("Long Weekends:", longweekendList);
        
        showlogweekends(); 
    } catch (error) {
        
        console.log("Error fetching long weekends:", error);
    }
}

function showlogweekends() {
    
    let box = "";    
    for (let i = 0; i < longweekendList.length; i++) {
        const item = longweekendList[i];
        const startDate = new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const endDate = new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        let infoBoxClass = item.needBridgeDay ? "warning" : "success";
        let infoText = item.needBridgeDay ? "Bridge day needed!" : "No extra days off needed!";

        box += `
        <div class="lw-card">
            <div class="lw-card-header">
                <span class="lw-badge"><i class="fa-solid fa-calendar-days"></i> ${item.dayCount} Days</span>
                <button class="holiday-action-btn"><i class="fa-regular fa-heart"></i></button>
            </div>
            <h3>Long Weekend #${i + 1}</h3>
            <div class="lw-dates"><i class="fa-regular fa-calendar"></i> ${startDate} - ${endDate}</div>
            <div class="lw-info-box ${infoBoxClass}"><i class="fa-solid fa-check-circle"></i> ${infoText}</div>
        </div>
        `;
    }

    const lwContainer = document.getElementById("lw-content");
    if (lwContainer) {
        lwContainer.innerHTML = box;
    }
}

// التشغيل عند فتح الصفحة
 //yearSelect = document.getElementById("yearSelect");
if (yearSelect) {
    yearSelect.addEventListener("change",function(){ getLongWeekends});
}

  //longweeksend_tab = document.getElementById("longweeksend-tab");
if (longweeksend_tab) {
    longweeksend_tab.addEventListener("click",function(){ getLongWeekends});
}


////////////////event////////////////////////////////////
let eventList=[];
async function getevents() {
        const countrycode= countrySelect.value;
        const citySelected = citySelect.value;
        let year = yearSelect.value;
    try {
        const req = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=VwECw2OiAzxVzIqnwmKJUG41FbeXJk1y&
            city=${citySelected}&countryCode=${countrycode}&size=20 `);
        let eventresponse = await req.json();
        eventList=eventresponse._embedded.events;
       // document.getElementById("events-view").classList.add("active");
        console.log("eveeeeeeeeeent", eventList);
         showevents();
    } catch (error) {      }
}


function showevents() {
    let box = "";

    for (let i = 0; i < eventList.length; i++) {
        let urlImg = eventList[i].images?.[0]?.url;
        let category = eventList[i].classifications?.[0]?.segment?.name;
        let title = eventList[i].name;
        let date = eventList[i].dates?.start?.localDate;
        let time = eventList[i].dates?.start?.localTime ? ` at ${eventList[i].dates.start.localTime.slice(0, 5)}` : "";
        let venueName = eventList[i]._embedded?.venues?.[0]?.name;
        let cityName = eventList[i]._embedded?.venues?.[0]?.city?.name;
        let ticketUrl = eventList[i].url;

        box += `
        <div class="event-card">
            <div class="event-card-image">
                <img src="${urlImg}" alt="${title}">
                <span class="event-card-category">${category}</span>
                <button class="event-card-save"><i class="fa-regular fa-heart"></i></button>
            </div>
            <div class="event-card-body">
                <h3>${title}</h3>
                <div class="event-card-info">
                    <div><i class="fa-regular fa-calendar"></i> ${date}${time}</div>
                    <div><i class="fa-solid fa-location-dot"></i> ${venueName}${cityName ? `, ${cityName}` : ""}</div>
                </div>
                <div class="event-card-footer">
                    <button class="btn-event"><i class="fa-regular fa-heart"></i> Save</button>
                    <a href="${ticketUrl}" target="_blank" class="btn-buy-ticket"><i class="fa-solid fa-ticket"></i> Buy Tickets</a>
                </div>
            </div>
        </div>
        `;
    }

    document.getElementById("events-content").innerHTML = box;
}


getevents();
if(events_tab){
events_tab.addEventListener("click", function() {
    
    getevents(); 
})};
if(citySelect){
citySelect.addEventListener("change", function() {
    getevents(); 
})};

