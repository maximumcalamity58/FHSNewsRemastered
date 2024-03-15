/**
 * @fileoverview Countdown timer for school schedule.
 * @version January 21, 2024
 **/

let timePeriodMapping = [
    { startTime: "08:15", endTime: "08:30", periodName: "Passing Period", color: "#666666", index: "0" },
    { startTime: "08:30", endTime: "09:53", periodName: "Period 1", color: "#f85454", index: "1" },
    { startTime: "09:53", endTime: "10:01", periodName: "Passing Period", color: "#666666", index: "2" },
    { startTime: "10:01", endTime: "11:24", periodName: "Period 2", color: "#fff26b", index: "3" },
    { startTime: "11:24", endTime: "13:24", periodName: "Period 3", color: "#b1ff7f", index: "4" },
    { startTime: "13:24", endTime: "13:32", periodName: "Passing Period", color: "#666666", index: "5" },
    { startTime: "13:32", endTime: "15:00", periodName: "Period 4", color: "#598eff", index: "6" }
];

let lunchPeriodMapping = [
    { startTime: "11:24", endTime: "11:54", periodName: "A Lunch", color: "#FFB6C1" },
    { startTime: "11:54", endTime: "12:24", periodName: "B Lunch", color: "#FFB6C1" },
    { startTime: "12:24", endTime: "12:54", periodName: "C Lunch", color: "#FFB6C1" },
    { startTime: "12:54", endTime: "13:24", periodName: "D Lunch", color: "#FFB6C1" },
]


let now = new Date();
let selectedPeriod = null;
let timeRemaining;

// Example schedules for different day types
const schedules = {
    "Red day": [
        { startTime: "08:15", endTime: "08:30", periodName: "Passing Period", color: "#FFD700", index: "0" },
        { startTime: "08:30", endTime: "09:53", periodName: "Period 1", color: "#FFA07A", index: "1" },
        { startTime: "09:53", endTime: "10:01", periodName: "Passing Period", color: "#ADD8E6", index: "2" },
        { startTime: "10:01", endTime: "11:24", periodName: "Period 2", color: "#90EE90", index: "3" },
        { startTime: "11:24", endTime: "13:24", periodName: "Period 3", color: "#87CEEB", index: "4" },
        { startTime: "13:24", endTime: "13:32", periodName: "Passing Period", color: "#ADD8E6", index: "5" },
        { startTime: "13:32", endTime: "15:00", periodName: "Period 4", color: "#98FB98", index: "6" }
    ],
    "Silver day": [
        { startTime: "08:00", endTime: "08:30", periodName: "Passing Period", color: "#FFD700", index: "0" },
        { startTime: "08:30", endTime: "09:53", periodName: "Period 5", color: "#FFA07A", index: "1" },
        { startTime: "09:53", endTime: "10:01", periodName: "Passing Period", color: "#ADD8E6", index: "2" },
        { startTime: "10:01", endTime: "11:24", periodName: "Period 6", color: "#90EE90", index: "3" },
        { startTime: "11:24", endTime: "13:24", periodName: "Period 7", color: "#87CEEB", index: "4" },
        { startTime: "13:24", endTime: "13:32", periodName: "Passing Period", color: "#ADD8E6", index: "5" },
        { startTime: "13:32", endTime: "15:00", periodName: "Tiered Intervention", color: "#98FB98", index: "6" }
    ],
    "Seven period day": [
        { startTime: "08:00", endTime: "08:30", periodName: "Passing Period", color: "#FFD700", index: "0" },
        { startTime: "08:30", endTime: "09:53", periodName: "Period 1", color: "#FFA07A", index: "1" },
        { startTime: "09:53", endTime: "10:01", periodName: "Passing Period", color: "#ADD8E6", index: "2" },
        { startTime: "10:01", endTime: "11:24", periodName: "Period 2", color: "#90EE90", index: "3" },
        { startTime: "11:24", endTime: "13:24", periodName: "Period 3", color: "#87CEEB", index: "4" },
        { startTime: "13:24", endTime: "13:32", periodName: "Passing Period", color: "#ADD8E6", index: "5" },
        { startTime: "13:32", endTime: "15:00", periodName: "Period 4", color: "#98FB98", index: "6" }
    ],
    "default-schedule": [
        { startTime: "08:00", endTime: "08:30", periodName: "Passing Period", color: "#FFD700", index: "0" },
        { startTime: "08:30", endTime: "09:53", periodName: "Period 1", color: "#FFA07A", index: "1" },
        { startTime: "09:53", endTime: "10:01", periodName: "Passing Period", color: "#ADD8E6", index: "2" },
        { startTime: "10:01", endTime: "11:24", periodName: "Period 2", color: "#90EE90", index: "3" },
        { startTime: "11:24", endTime: "13:24", periodName: "Period 3", color: "#87CEEB", index: "4" },
        { startTime: "13:24", endTime: "13:32", periodName: "Passing Period", color: "#ADD8E6", index: "5" },
        { startTime: "13:32", endTime: "15:00", periodName: "Period 4", color: "#98FB98", index: "6" }
    ]
};

function setScheduleForDayType(dayType) {
    if (schedules[dayType]) {
        timePeriodMapping = schedules[dayType];
    } else {
        console.error(`No schedule found for day type: ${dayType}`);
        timePeriodMapping = schedules["default-schedule"]; // Fallback to default schedule
    }
}

function createProgressBar() {
    const progressBar = document.getElementById("progress_bar");
    progressBar.innerHTML = "";

    // Calculate total minutes in the school day
    const schoolDayStart = convertToDateTime(timePeriodMapping[0].startTime);
    const schoolDayEnd = convertToDateTime(timePeriodMapping[timePeriodMapping.length - 1].endTime);
    const totalSchoolDayMinutes = (schoolDayEnd - schoolDayStart) / 60000;

    // Create period segments for the progress bar
    timePeriodMapping.forEach(period => {
        const periodDiv = document.createElement("div");
        periodDiv.className = "period-segment";
        periodDiv.style.backgroundColor = period.color;
        periodDiv.style.flexGrow = (getDurationInMinutes(period.startTime, period.endTime) / totalSchoolDayMinutes).toString();
        periodDiv.onclick = () => selectPeriod(period);
        progressBar.appendChild(periodDiv);
    });

    updateProgressBar();
}


function selectPeriod(period) {
    selectedPeriod = period;

    console.log(selectedPeriod)

    document.getElementById("period__header").textContent = period.periodName;
    document.getElementById("period__time").textContent = `${formatTime24To12(period.startTime)} - ${formatTime24To12(period.endTime)}`;

    let periodStart = convertToDateTime(period.startTime);
    let periodEnd = convertToDateTime(period.endTime);
    selectedPeriod.isPast = now > periodStart;
    selectedPeriod.isCurrent = now > periodStart && now < periodEnd;

    updateCountdownTimer();
}

async function updateCountdownTimer() {
    now = new Date();

    if (!await getCurrentSchoolDay(now)) {
        // If today is not a school day, calculate the time remaining to the next school day
        const nextSchoolDayInfo = await getNextSchoolDay(now);
        if (nextSchoolDayInfo && nextSchoolDayInfo.date) {
            const nextDayStartTime = convertToDateTime(schedules[nextSchoolDayInfo.type][0].startTime, nextSchoolDayInfo.date);
            timeRemaining = (nextDayStartTime - now) / 1000;
        } else {
            // If no next school day is found, display "No School Today"
            countdown.textContent = "No School Today";
            return;
        }
    } else if (selectedPeriod) {
        if (selectedPeriod.isPast && !selectedPeriod.isCurrent) {
            const nextSchoolDayInfo = await getNextSchoolDay(now);
            if (nextSchoolDayInfo && nextSchoolDayInfo.date) {
                setScheduleForDayType(nextSchoolDayInfo.type);
                const nextDaySchedule = schedules[nextSchoolDayInfo.type];

                // Check if selectedIndex is within range and find nextPeriod
                if (selectedPeriod.index !== -1 && selectedPeriod.index < nextDaySchedule.length) {
                    const nextPeriod = nextDaySchedule[selectedPeriod.index];

                    if (nextPeriod) {
                        let nextPeriodStartTime = convertToDateTime(nextPeriod.startTime, nextSchoolDayInfo.date);
                        selectPeriod(nextPeriod);
                        timeRemaining = (nextPeriodStartTime - now) / 1000;
                    } else {
                        timeRemaining = 0; // If the period is not found in the next day's schedule
                    }
                } else {
                    timeRemaining = 0; // If the index is invalid
                }
            } else {
                timeRemaining = 0; // If no next school day is found
            }
        } else if (selectedPeriod.isCurrent) {
            let periodEndTime = convertToDateTime(selectedPeriod.endTime);
            timeRemaining = (periodEndTime - now) / 1000;
        } else {
            let periodStartTime = convertToDateTime(selectedPeriod.startTime);
            timeRemaining = (periodStartTime - now) / 1000;
        }
    } else {
        let lastPeriodEndTime = convertToDateTime(timePeriodMapping[timePeriodMapping.length - 1].endTime);
        let firstPeriodStartTime = convertToDateTime(timePeriodMapping[0].startTime);

        if (now < firstPeriodStartTime) {
            timeRemaining = (firstPeriodStartTime - now) / 1000;
        } else if (now > lastPeriodEndTime) {
            const nextSchoolDayInfo = await getNextSchoolDay(now);

            if (nextSchoolDayInfo && nextSchoolDayInfo.date) {
                setScheduleForDayType(nextSchoolDayInfo.type);
                let nextDayFirstPeriodStartTime = convertToDateTime(schedules[nextSchoolDayInfo.type][0].startTime, nextSchoolDayInfo.date);
                timeRemaining = (nextDayFirstPeriodStartTime - now) / 1000;
            } else {
                // Check if it's within the default school hours
                const defaultSchoolDayStart = convertToDateTime(timePeriodMapping[0].startTime);
                const defaultSchoolDayEnd = convertToDateTime(timePeriodMapping[timePeriodMapping.length - 1].endTime);
                if (now >= defaultSchoolDayStart && now <= defaultSchoolDayEnd) {
                    // It's within default school hours, but not a school day
                    countdown.textContent = "No School Today";
                    return;
                }
                timeRemaining = 0;
            }
        } else {
            timeRemaining = 0;
        }
    }

    displayTime(timeRemaining);
}

function formatTime24To12(time24) {
    const [hours24, minutes] = time24.split(':');
    const hours = parseInt(hours24, 10);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hours12 = ((hours + 11) % 12 + 1);
    return `${hours12}:${minutes} ${suffix}`;
}


function updateProgressBar() {
    now = new Date();
    let currentTimeIndicator = document.getElementById("current_time_indicator");

    // Only show and update the indicator during school hours
    const schoolDayStart = convertToDateTime(timePeriodMapping[0].startTime);
    const schoolDayEnd = convertToDateTime(timePeriodMapping[timePeriodMapping.length - 1].endTime);
    if (now >= schoolDayStart && now <= schoolDayEnd) {
        currentTimeIndicator.style.display = 'block';

        let totalSchoolDayMinutes = (schoolDayEnd - schoolDayStart) / 60000;
        let minutesSinceStart = (now - schoolDayStart) / 60000;
        currentTimeIndicator.style.left = (minutesSinceStart / totalSchoolDayMinutes * 100) + '%';
    } else {
        currentTimeIndicator.style.display = 'none';
    }
}

function displayTime(seconds) {
    let countdown = document.getElementById("countdown__timer");
    if (seconds > 0) {
        let days = Math.floor(seconds / 86400)
        let hours = Math.floor((seconds % 86400) / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secondsLeft = Math.floor(seconds % 60);

        let timeText = '';

        if (days > 0) {
            timeText += `${days}:${hours < 10 ? '0' : ''}`;
        }

        if (hours > 0) {
            timeText += `${hours}:`;
        }

        timeText += `${minutes < 10 ? '0' : ''}${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;

        countdown.textContent = timeText;
    } else {
        countdown.textContent = "00:00";
    }
}

let data;

// New functions for fetching calendar data and finding the next school day
async function fetchCalendarData(date) {
    const year = date.getFullYear();
    const month = (date.getMonth()).toString().padStart(2, '0');
    const url = `${window.staticURL}py/calendar/calendar-data/19-fishers-high-school/${year}-${month}.json`;

    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error('Error fetching calendar data:', error));
}

async function getNextSchoolDay(currentDate) {
    let date = new Date(currentDate);
    date.setDate(date.getDate() + 1); // Start checking from the next day
    date.setMonth(date.getMonth() + 1);
    let calendarData = await fetchCalendarData(date);
    date.setMonth(date.getMonth() - 1)
    date.setDate(date.getDate());
    if (!calendarData) {
        console.error('No calendar data available');
        return { date: null, type: 'default-schedule' };
    }

    const maxDaysToCheck = 180; // Limit to checking 30 days ahead
    let month = date.getMonth() + 1; // Adjust to 1-based index
    let year = date.getFullYear();

    for (let i = 0; i < maxDaysToCheck; i++) {
        const day = date.getDate();

        if (calendarData[day]) {
            for (let event of calendarData[day]) {
                if (isSchoolDay(event.title)) {
                    return { date, type: event.title };
                }
            }
        }

        // Move to the next day
        date.setDate(date.getDate() + 1);

        // Check if the month or year has changed
        if (date.getMonth() + 1 !== month || date.getFullYear() !== year) {
            month = date.getMonth() + 1;
            year = date.getFullYear();

            // Fetch new calendar data for the new month
            calendarData = await fetchCalendarData(date);
            console.log(calendarData);
            if (!calendarData) {
                console.error('Calendar data not available for the new month');
                return { date: null, type: 'default-schedule' };
            }
        }
    }

    return { date: null, type: 'default-schedule' };
}

async function getCurrentSchoolDay(currentDate) {
    let date = new Date(currentDate);
    date.setMonth(date.getMonth() + 1);
    let calendarData = await fetchCalendarData(date);
    date.setMonth(date.getMonth() - 1)
    date.setDate(date.getDate());
    if (!calendarData) {
        console.error('No calendar data available');
        return false;
    }

    const maxDaysToCheck = 1; // Limit to checking 30 days ahead
    let month = date.getMonth() + 1; // Adjust to 1-based index
    let year = date.getFullYear();

    for (let i = 0; i < maxDaysToCheck; i++) {
        const day = date.getDate();

        if (calendarData[day]) {
            for (let event of calendarData[day]) {
                if (isSchoolDay(event.title)) {
                    return true;
                }
            }
        }

        // Move to the next day
        date.setDate(date.getDate() + 1);

        // Check if the month or year has changed
        if (date.getMonth() + 1 !== month || date.getFullYear() !== year) {
            month = date.getMonth() + 1;
            year = date.getFullYear();

            // Fetch new calendar data for the new month
            calendarData = await fetchCalendarData(date);
            if (!calendarData) {
                console.error('Calendar data not available for the new month');
                return false;
            }
        }
    }

    return false;
}


function isSchoolDay(title) {
    return title.toLowerCase().includes('red day') ||
           title.toLowerCase().includes('silver day') ||
           title.toLowerCase().includes('seven period day');
}



function getTotalMinutes(startTime, endTime) {
    let [startHours, startMinutes] = startTime.split(':').map(Number);
    let [endHours, endMinutes] = endTime.split(':').map(Number);
    return (endHours - startHours) * 60 + (endMinutes - startMinutes);
}

function getDurationInMinutes(startTime, endTime) {
    let start = convertToDateTime(startTime);
    let end = convertToDateTime(endTime);
    return (end - start) / 60000;
}

function convertToDateTime(timeStr, specificDate = null) {
    let [hours, minutes] = timeStr.split(':').map(Number);
    let date = specificDate ? new Date(specificDate) : new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

function getCurrentPeriod() {
    for (let period of timePeriodMapping) {
        let periodStart = convertToDateTime(period.startTime);
        let periodEnd = convertToDateTime(period.endTime);
        if (now > periodStart && now < periodEnd) {
            return period;
        }
    }
    return null;
}

function getNextPeriod() {
    for (let period of timePeriodMapping) {
        let periodStart = convertToDateTime(period.startTime);
        if (now < periodStart) {
            return period;
        }
    }
    return null;
}

function initialize() {
    // Automatically select the appropriate period on page load
    selectedPeriod = getCurrentPeriod();
    if (selectedPeriod) {
        selectPeriod(selectedPeriod);
    }

    createProgressBar();
    updateCountdownTimer();
    updateProgressBar();
    setInterval(updateProgressBar, 5000);
    setInterval(updateCountdownTimer, 250);
}

window.addEventListener("DOMContentLoaded", initialize);