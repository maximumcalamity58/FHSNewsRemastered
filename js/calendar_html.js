/**
 * Creates a schedule heading
 * @param {string} ID - name of the schedule
 * @returns HTML elements to display for the heading
 */
function createScheduleHead(ID = ""){
  let headingElements = [
    createElement("div", ["class","schedule_container edit"],
    ["children",
      [
        createElement("div",["class","schedule_text_container"],
        ["children",
          [
            createElement("p",["text" , (ID === "")? "Undefined" : JSON_sched[ID].metadata.name])
          ]
        ])
      ]
    ])
  ];
  return headingElements;
}
/**
 * Create schedule HTML to display a single period name, times, and possible sub-entries
 * @param {Object} period object with name, start time, end time
 * @returns HTML element
 */
function createScheduleMain(period = {name:"", startTimeDigits: "", endTimeDigits:""}){
  return createElement("div",["class","schedule_part"],["children",
    [
      createPeriodHeading(period.name),
      createPeriodTime(period)
    ]
  ]);
}
/**
 * Creates period heading
 */
function createPeriodHeading(name = ""){
  return createElement("div", ["class", "period_heading"], ["children",
    [
      createElement("p",["text",name])
    ]
  ])
}
/**
 * Creates period timing HTML display
 */
function createPeriodTime(period = {startTimeDigits: "", endTimeDigits: ""}){
  return createElement("div", ["class", "period_time"], ["children",[
  createElement("p", ["text",  to12HTime(period.startTimeDigits)]),
  createElement("p", ["text", "-"] ),
  createElement("p", ["text",  to12HTime(period.endTimeDigits)])
  ] ]
  );
}

/**
 *
 */
function createScheduleLabelBlock(name = "", subParts = []){
  let block = createElement("div", ["class","label_block"], ["children",
  [createPeriodHeading(name, true, true)]
  ]);
  for(let part of subParts){
    block.appendChild(createScheduleMain(part, false, true));
  }

  return block;
}
/**
 * Displays schedule passed in
 * @param {String} ID id of the schedule to display
 */
function fillSchedule(ID){
  let head = scheduleSection.children[0].children[0],
  body = scheduleSection.children[0].children[1],
  container;
  for (let item of createScheduleHead(ID)) {
    head.appendChild(item);
  }
  for(let i=0; i < JSON_sched[ID].periods.length; i++){
    container = createElement("div", ["class","part_container"]);
    container.appendChild(createScheduleMain(JSON_sched[ID].periods[i]));
    if(JSON_sched[ID].periods[i].intraschedule != null){
      for(let key of Object.getOwnPropertyNames(JSON_sched[ID].periods[i].intraschedule) ){
          container.appendChild(createScheduleLabelBlock(key, JSON_sched[ID].periods[i].intraschedule[key]));
      }
    }

    body.appendChild( container );
  }
}

/**
 * clears currently displayed HTML
 */
function clearSchedule(){
    for(let i =0; i < 2; i++){
        while(scheduleSection.children[0].children[i].firstChild){
            scheduleSection.children[0].children[i].removeChild(scheduleSection.children[0].children[i].firstChild);
        }
    }
}

/**
 * fills schedule editing section with the current schedule
 * @param {boolean} isNew whether a new or existing schedule
 */
function displaySchedule(ID) {
    clearSchedule();
    fillSchedule(ID);
    scheduleSection.classList = "";
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------

/**
 * Set schedule data on each calendar day for current month
 * containers - HTML elements containing days on calendar (stored in columns)
 * calendar - global calendar object
 * JSON_calendar - global variable representing JSON object to store in file
 */
function setMonthSchedules(containers) {
    let days = calendar.getFullMonth();
    let sched;
    for (let i = 0; i < 42; i++) {
        let dayParagraphElm = containers[i % 7].children[1].children[Math.floor(i / 7)];
        (JSON_calendar[days[i].year] === undefined)? //get schedule for the day
            sched = "000" :
            sched = JSON_calendar[days[i].year][days[i].month - 1][days[i].day - 1];
        if (JSON_sched[sched] === undefined) {sched = "000";}
        dayParagraphElm.innerHTML = days[i].day; //set day number
        dayParagraphElm.style =
            getBackground(JSON_sched[sched].metadata.color, (days[i].month == calendar.currentMonth)); //set day color and background

        if (days[i].userData === undefined) {
            days[i].userData = {active: sched, previous: null}
        } else {
            days[i].userData.active = sched;
        }

        dayParagraphElm.onclick = function() { //update schedule information when clicking on day
            displaySchedule(days[i].userData.active);
        }
    }
}

/**
 * Sets the month heading to current month and year
 * Sets days of month with proper schedule and coloring
 * calendarSection - global variable reference to calendar in HTML
 * calendar - global Calendar object
 */
function setCurrentMonthDisplay() {
    calendarSection.children[0].children[1].children[0].textContent =
        MONTH_NAMES[calendar.currentMonth -1] + " " + calendar.currentYear;
    setMonthSchedules(calendarSection.children[1].children);
}

/**
 * calculates if the text inside the color needs to be switched (ex. black to white)
 * returns a string for HTML stylesheet
 */
function getBackground(color, inMonth) {
    return "background:radial-gradient(1.5rem circle," + color + " 40%," +  ((inMonth)? "transparent": "var(--secondary-background-color)")  + " 41%);\
    color:var(--container-text-color)";
}

/**
 * Converts 24 hour to 12 hour time
 * @param {String} time time in HH:MM form
 * @returns String time in HH:MM form
 */
function to12HTime(time) {
    time = time.split(":");
    let digit = parseInt(time[0]);
    time[0] = (digit > 12)? padDigit(digit % 12) : padDigit( digit );
    return time.join(":");
}
function padDigit(number) {
  if (number < 10) {
      return `0${number}`
  } else {
      return number + '';
  }
}