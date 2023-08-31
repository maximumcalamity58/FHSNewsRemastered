/**
 * @fileoverview This file updates the current time as a simple countdown.
 * @version August 25, 2023
 * @authors Maxime Hendryx-Parker
 **/

var countdown;
var now = new Date();
var endTime;
let hasAdvanced = false;  // Add this flag at the top of the file to track whether we have already advanced the period
let manualNavigation = false; // Flag to indicate manual navigation

var timePeriodMapping = [
    { startTime: "08:00", endTime: "08:30", periodName: "Passing Period" },
    { startTime: "08:30", endTime: "09:53", periodName: "Period 1" },
    { startTime: "09:53", endTime: "10:01", periodName: "Passing Period" },
    { startTime: "10:01", endTime: "11:24", periodName: "Period 2" },
    { startTime: "11:24", endTime: "13:24", periodName: "Period 3 & Lunch" },
    { startTime: "13:24", endTime: "13:32", periodName: "Passing Period" },
    { startTime: "13:32", endTime: "15:00", periodName: "Period 4" },
];

var lunchTimings = {
    "A": { startTime: "11:24", endTime: "11:54", periodName: "A Lunch" },
    "B": { startTime: "11:54", endTime: "12:24", periodName: "B Lunch" },
    "C": { startTime: "12:24", endTime: "12:54", periodName: "C Lunch" },
    "D": { startTime: "12:54", endTime: "13:24", periodName: "D Lunch" },
};


// At the top of the file
let currentPeriodIndex = getCurrentPeriodIndex();

function getCurrentPeriodIndex() {
    for (let i = 0; i < timePeriodMapping.length; i++) {
        let [endHours, endMinutes] = timePeriodMapping[i].endTime.split(":").map(Number);
        let potentialEndTime = new Date(now);
        potentialEndTime.setHours(endHours, endMinutes, 0, 0);

        if (now < potentialEndTime) {
            return i;
        }
    }
    return -1; // Return 0 if outside of all periods
}

function to12HourFormat(timeStr) {
    let [hours, minutes] = timeStr.split(":").map(Number);
    hours = hours % 12 || 12; // Convert 0 hours to 12 for 12 AM
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes}`;
}

window.advanceToNextPeriod = function() {
    manualNavigation = true;
    if (currentPeriodIndex < timePeriodMapping.length - 1) {
        currentPeriodIndex++;
        updatePeriod();
    } else if (currentPeriodIndex === timePeriodMapping.length - 1) {
        currentPeriodIndex = -1;
        updatePeriod();
    }
}

window.advanceToPreviousPeriod = function() {
    manualNavigation = true;
    if (currentPeriodIndex > -1) {
        currentPeriodIndex--;
        updatePeriod();
    } else if (currentPeriodIndex === -1) {
        currentPeriodIndex = timePeriodMapping.length-1;
        updatePeriod()
    }
}


/**
 * Initialize the countdown variables and start the tick function.
 */
function initializeCountdown() {
    countdown = document.getElementById("countdown__timer");
    now = new Date();

    if (!isSchoolHours() || getCurrentPeriodIndex() === -1) {
        manualNavigation = true
    }

    updatePeriod();
    tick();
}

function isSchoolHours() {
    let firstStartTime = new Date().setHours(...timePeriodMapping[0].startTime.split(":"));
    let lastEndTime = new Date().setHours(...timePeriodMapping.slice(-1)[0].endTime.split(":"));
    return (new Date() >= firstStartTime && new Date() <= lastEndTime);
}

let selectedLunchType = null; // This will store the type of lunch selected, if any

function updatePeriod() {
    let currentPeriodMapping = timePeriodMapping[currentPeriodIndex];

    let realCurrentPeriodIndex = getCurrentPeriodIndex();

    if (currentPeriodMapping) {
        // If current period is "Period 3 & Lunch"
        if (currentPeriodMapping.periodName === "Period 3 & Lunch" && selectedLunchType) {
            currentPeriodMapping = lunchTimings[selectedLunchType];

            let [lunchStartHours, lunchStartMinutes] = currentPeriodMapping.startTime.split(":").map(Number);
            let lunchStartTime = new Date(now);
            lunchStartTime.setHours(lunchStartHours, lunchStartMinutes, 0, 0);

            if (now < lunchStartTime) {
                // If the selected lunch has not started, set endTime to its startTime
                endTime = lunchStartTime;
            } else {
                // If the selected lunch has started, set endTime to its actual endTime
                let [lunchEndHours, lunchEndMinutes] = currentPeriodMapping.endTime.split(":").map(Number);
                endTime = new Date(now);
                endTime.setHours(lunchEndHours, lunchEndMinutes, 0, 0);
            }
        } else {
            let [endHours, endMinutes] = currentPeriodMapping.endTime.split(":").map(Number);
            let [startHours, startMinutes] = currentPeriodMapping.startTime.split(":").map(Number);

            if (realCurrentPeriodIndex !== currentPeriodIndex) {
                // If the period being looked at is not the current period, set endTime to startTime
                endTime = new Date(now);
                endTime.setHours(startHours, startMinutes, 0, 0);
            } else {
                // Otherwise, set endTime to the actual end time of the period
                endTime = new Date(now);
                endTime.setHours(endHours, endMinutes, 0, 0);
            }
        }

        document.getElementById("period__header").textContent = currentPeriodMapping.periodName;
        document.getElementById("period__time").textContent = `${to12HourFormat(currentPeriodMapping.startTime)} - ${to12HourFormat(currentPeriodMapping.endTime)}`;

        let [startHours, startMinutes] = currentPeriodMapping.startTime.split(":").map(Number);
        let periodStartTime = new Date(now);
        periodStartTime.setHours(startHours, startMinutes, 0, 0);

        let lunchButtons = document.getElementById("lunch");
        if (currentPeriodMapping.periodName === "Period 3 & Lunch" || currentPeriodMapping === lunchTimings[selectedLunchType]) {
            lunchButtons.classList.remove("hidden");
        } else {
            lunchButtons.classList.add("hidden");
        }

        console.log(currentPeriodMapping.periodName);

        updateProgressBar(periodStartTime, endTime);
    } else {
        endTime = new Date(now);
        document.getElementById("period__header").textContent = "Not School Hours";
        document.getElementById("period__time").textContent = to12HourFormat(timePeriodMapping[timePeriodMapping.length-1].endTime) + " - " + to12HourFormat(timePeriodMapping[0].startTime);
    }

    if (manualNavigation) {
        if (now > endTime) {
            endTime.setDate(endTime.getDate() + 1);
        }
        manualNavigation = false; // Reset the flag
    }

    console.log("sup")

    // Update gallery dots
    let gallery = document.getElementById("period__gallery");
    gallery.innerHTML = ""; // Clear existing dots

    for (let i = 0; i < timePeriodMapping.length; i++) {
        let dot = document.createElement("div");
        dot.className = "gallery-dot";

        // Mark the active dot based on the current period
        if (i === currentPeriodIndex) {
            dot.classList.add("active");
        }

        gallery.appendChild(dot);
    }
}

function updateProgressBar(periodStartTime, periodEndTime) {
    const totalDuration = periodEndTime - periodStartTime;
    const elapsedDuration = now - periodStartTime;

    // Calculate the percentage of time elapsed
    const progressPercentage = (elapsedDuration / totalDuration) * 100;

    // Set the width of the progress bar
    document.getElementById("countdown__progress").style.width = `${progressPercentage}%`;
}

window.chooseLunch = function(lunchType, buttonElement) {
    // Get all lunch buttons
    let allLunchButtons = document.querySelectorAll("#lunch__choose .container");

    // If the button clicked is already selected
    if (buttonElement.classList.contains("selected")) {
        // Deselect the button
        buttonElement.classList.remove("selected");
        // Reset the selected lunch type
        selectedLunchType = null;
    } else {
        // If another button was previously selected, deselect it
        allLunchButtons.forEach(btn => btn.classList.remove("selected"));

        // Mark the clicked button as selected
        buttonElement.classList.add("selected");
        // Set the selected lunch type
        selectedLunchType = lunchType;
    }

    // Update the period to reflect the changes
    manualNavigation = true;
    updatePeriod();
}



/**
 * updates the current time and countdown timer
 */
function updateClock() {
    now = new Date();
    let timeRemaining;

    // If it's not school hours
    if (currentPeriodIndex === -1) {
        let [firstStartHours, firstStartMinutes] = timePeriodMapping[0].startTime.split(":").map(Number);
        let firstStartTime = new Date(now);
        firstStartTime.setHours(firstStartHours, firstStartMinutes, 0, 0);

        // If the time has passed for today, set for next day
        if (now > firstStartTime) {
            firstStartTime.setDate(firstStartTime.getDate() + 1);
        }

        timeRemaining = (firstStartTime - now) / 1000; // in seconds
    }
    // Otherwise, it's a regular school period or passing period
    else {
        timeRemaining = (endTime - now) / 1000; // in seconds
    }

    // Reset hasAdvanced flag if the time is not yet expired
    if (timeRemaining > 0) {
        hasAdvanced = false;
    }

    if (timeRemaining <= 0 && !hasAdvanced && !manualNavigation) {
        // ... (existing logic to advance the period)
        currentPeriodIndex = getCurrentPeriodIndex();
        updatePeriod();
        hasAdvanced = true;
    }

    // If the time has already expired and it's a manual navigation
    if (timeRemaining <= 0 && manualNavigation) {
        endTime.setDate(endTime.getDate() + 1);
        timeRemaining = (endTime - now) / 1000;
        manualNavigation = false; // Reset the flag
    }

    if (timeRemaining < 0) {
        timeRemaining = (endTime - now) / 1000
    }

    // Calculate hours, minutes, seconds
    let hours = Math.floor(timeRemaining / 3600);
    timeRemaining %= 3600;
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = Math.floor(timeRemaining % 60);

    // Display time
    if (hours > 0) {
        countdown.textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else {
        countdown.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Update the progress bar
    let currentPeriodMapping = timePeriodMapping[currentPeriodIndex];
    if (currentPeriodMapping) {
        let [startHours, startMinutes] = currentPeriodMapping.startTime.split(":").map(Number);
        let periodStartTime = new Date(now);
        periodStartTime.setHours(startHours, startMinutes, 0, 0);
        updateProgressBar(periodStartTime, endTime);
    }
}


// main loop
function tick() {
    updateClock();
    requestAnimationFrame(tick);
}

window.addEventListener("DOMContentLoaded", initializeCountdown);
