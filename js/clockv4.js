/**
 * @fileoverview This file updates the current time as a simple countdown.
 * @version August 25, 2023
 * @authors Maxime Hendryx-Parkerp
 **/

var countdown;
var now = new Date();
var endTime;

var timePeriodMapping = [
    { startTime: "08:30", endTime: "09:53", periodName: "Period 1" },
    { startTime: "09:53", endTime: "10:01", periodName: "Passing Period" },
    { startTime: "10:01", endTime: "11:24", periodName: "Period 2" },
    { startTime: "11:24", endTime: "11:32", periodName: "Passing Period" },
    { startTime: "11:32", endTime: "13:24", periodName: "Period 3 & Lunch" },
    { startTime: "13:24", endTime: "13:32", periodName: "Passing Period" },
    { startTime: "13:32", endTime: "15:00", periodName: "Period 4" }
];

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
    return 0; // Default to the first period if no matching period found
}

function to12HourFormat(timeStr) {
    let [hours, minutes] = timeStr.split(":").map(Number);
    hours = hours % 12 || 12; // Convert 0 hours to 12 for 12 AM
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes}`;
}

window.advanceToNextPeriod = function() {
    console.log("e")
    if (currentPeriodIndex < timePeriodMapping.length - 1) {
        currentPeriodIndex++;
        updatePeriod();
    }
}

window.advanceToPreviousPeriod = function() {
    if (currentPeriodIndex > 0) {
        currentPeriodIndex--;
        updatePeriod();
    }
}


/**
 * Initialize the countdown variables and start the tick function.
 */
function initializeCountdown() {
    countdown = document.getElementById("countdown__timer");
    now = new Date();
    updatePeriod();
    tick();
}

function updatePeriod() {
    let currentPeriodMapping = timePeriodMapping[currentPeriodIndex];

    if (currentPeriodMapping) {
        let [endHours, endMinutes] = currentPeriodMapping.endTime.split(":").map(Number);
        endTime = new Date(now);
        endTime.setHours(endHours, endMinutes, 0, 0);

        document.getElementById("period__header").textContent = currentPeriodMapping.periodName;
        document.getElementById("period__time").textContent = `${to12HourFormat(currentPeriodMapping.startTime)} - ${to12HourFormat(currentPeriodMapping.endTime)}`;

        let [startHours, startMinutes] = currentPeriodMapping.startTime.split(":").map(Number);
        let periodStartTime = new Date(now);
        periodStartTime.setHours(startHours, startMinutes, 0, 0);

        updateProgressBar(periodStartTime, endTime);
    } else {
        endTime = new Date(now);
        document.getElementById("period__header").textContent = "Not School Hours";
        document.getElementById("period__time").textContent = "";
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

/**
 * updates the current time and countdown timer
 */
function updateClock() {
    now = new Date();
    let timeRemaining = (endTime - now) / 1000; // in seconds

    // If the countdown has expired, update the period
    if (timeRemaining <= 0) {
        // Adjust endTime to the next day's end time
        endTime.setDate(endTime.getDate() + 1);
        timeRemaining = (endTime - now) / 1000;
    }

    // Calculate hours, minutes, seconds
    let hours = Math.floor(timeRemaining / 3600);
    timeRemaining %= 3600;
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = Math.floor(timeRemaining % 60);

    // Display time
    countdown.textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

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
