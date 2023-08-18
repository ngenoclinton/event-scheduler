document.addEventListener ('DOMContentLoaded', function(){
    const calendar = document.getElementById('calender');
    const date  = document.getElementById('date');
    const daysContainer = document.getElementById('days');
    const weekdays = document.getElementById('weekdays');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');

    const todayBtn = document.getElementById('today-btn');
    const gotoBtn = document.getElementById('goto-btn');
    const inputDate = document.getElementById('date-input');

   // ADD EVENTS SECTION SCRIPTS 
   const addEventWrapper = document.querySelector('.add-event-wrapper');
   const addEventsCloseBtn = document.querySelector('.close');
   const addEventsBtn = document.querySelector('.add-event-btn');
   const addEvent = document.querySelector('.add-event');
   const eventTitle = document.querySelector('.event-name');
   const eventTimeFrom = document.querySelector('.event-time-from');
   const eventTimeTo = document.querySelector('.event-time-to');


    let today = new Date();
    let activeDay;
    let dayToday = today.getDate();
    let day = today.getDay();
    let month = today.getMonth();
    let year = today.getFullYear();

    const months =[
        'January','February','March','April','May', 'June','July','August','September','October','November','December'
    ]
// default events array 
// const eventsArr = [
//     {
//     day:3,
//     month:8,
//     year:2023,
//     events:[
//         {
//             title:'Event1 lorem ipsumm dolar mait',
//             time:'10:00 AM'
//         }
//     ]
//     },
//     {
//     day:12,
//     month:8,
//     year:2023,
//     events:[
//         {
//             title:'Event1 lorem ipsumm dolar mait',
//             time:'10:00 AM'
//         },
        
//     ]
//     }

// ]
        
    const eventsArr = [];
    getEvents();
    console.log(eventsArr);
    // function to add days
    function initCalendar (){
        // to get prev month, days, and current month all days and rem next month days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);

        const prevDays = prevLastDay.getDate();
        const lastDate = lastDay.getDate();
        const day = firstDay.getDay();

        const nextDays = 7 - lastDay.getDay() - 1;

        // 
        date.innerHTML =  months[month] + ' ' + dayToday + ', ' + year;
        //adding days on dom
        let days=''
        
        // prev months and days
        for(let d = day; d > 0; d--){
            days += `<div class='day prev-date day h-[50px] flex justify-center items-center cursor-pointer border-[1px] border-green-300 w-[13%]'>${prevDays - d + 1}</div>`;
        }   
        
        // current month days
        for(let i = 1; i <= lastDate; i++){
        // check if event present on current day
        let event = false;
        eventsArr.forEach((eventsObj)=>{
            if(
                eventsObj.day === i &&
                eventsObj.month === month + 1 &&
                eventsObj.year === year
            ){
                // if event found return true 
                event = true; 
            }
        })
        // updateEvents(i);
        // if day is today add class today
         if (
             i === new Date().getDate() &&
             year === new Date().getFullYear() &&
             month === new Date().getMonth()
            ){

            activeDay=i;
            getActiveDay(i);   
            updateEvents(i);
            // if event found also add event class
            if(event) {
                days += `<div class="day today event active h-[50px] flex justify-center items-center cursor-pointer border-[1px] border-green-300 w-[13%]">${i}</div>`
            } else{
                days += `<div class="day today active h-[50px] flex justify-center items-center cursor-pointer border-[1px] border-green-300 w-[13%]">${i}</div>`
            }
        }
        // else add remaining as it is 
        else {
           if(event){
             days += `<div class="day event h-[50px] flex justify-center items-center cursor-pointer border-[1px] border-green-300 w-[13%]">${i}</div>`
            }else{
             days += `<div class="day h-[50px] flex justify-center items-center cursor-pointer border-[1px] border-green-300 w-[13%]">${i}</div>`
            }
        }
    }

        // next month days 
        for (let j = 1; j <= nextDays; j++) {
            days += `<div class="day day h-[50px] flex justify-center items-center cursor-pointer border-[1px] border-green-300 w-[13%]">${j}</div>`            
        }
        daysContainer.innerHTML = days;
        // add Listener after calender initialized
        addListener();
    }
    

    // prev month
    const prevMonths = ()=>{
        month--;
        if(month < 0){
            month = 11
            year--;
        }
        initCalendar();
    }
    const nextMonths = ()=>{
        month++;
        if(month>11){
            month = 0
            year++;
        }
        initCalendar();
    }

    prev.addEventListener('click', prevMonths);
    next.addEventListener('click',nextMonths);

    // 
    todayBtn.addEventListener('click', function(e) {
        today = new Date();
        month = today.getMonth();
        year = today.getFullYear();

        initCalendar();
    })

        // function to get date input
        inputDate.addEventListener('input', (e) =>{
            // allow only numbers remove anything else 
            inputDate.value =inputDate.value.replace(/[^0-9]/g,'');

            if (inputDate.value.length >= 2) {
                // Add a slash after the second character if not already present
                if (inputDate.value.charAt(2) !== '/') {
                  inputDate.value = inputDate.value.slice(0, 2) + "/" + inputDate.value.slice(2);
                }
              }
            
            if (inputDate.value.length >= 5) {
                // Add a slash after the fifth character if not already present
                if (inputDate.value.charAt(5) !== '/') {
                  inputDate.value = inputDate.value.slice(0, 5) + "/" + inputDate.value.slice(5);
                }
              }
            
              // Limit the length of the input to 10 characters (DD / MM / YYYY)
              if (inputDate.value.length > 10) {
                inputDate.value = inputDate.value.slice(0, 10);
              }
            // Handle character deletion (backspace)
            if (e.inputType === 'deleteContentBackward') {
                if (inputDate.value.length === 4 || inputDate.value.length === 7) {
                // Remove the slash when the user deletes backward before the slash
                inputDate.value = inputDate.value.slice(0, inputDate.value.length - 2);
                }
            }
        });

    // function to go to entered date   
    const gotoDate = () =>{
        const dateArr = inputDate.value.split('/');
        console.log(dateArr, dateArr.length); 
      
        // Some data validation
        if (dateArr.length === 3) {
          if (dateArr[0] > 0 && dateArr[0] <= 31 && dateArr[1] >= 1 && dateArr[1] <= 12 && dateArr[2].length === 4) {
            dayToday = parseInt(dateArr[0]);
            month = parseInt(dateArr[1]) - 1;
            year = parseInt(dateArr[2]);
            console.log(dayToday, month, year);
            initCalendar();
            return;
          }
            // if invalid date 
            alert('Invalid date');
        }
    }
    // 
    gotoBtn.addEventListener('click', gotoDate);

 
    addEvent.addEventListener('click', ()=>{
        addEventWrapper.classList.toggle('active');
    })
    addEventsCloseBtn.addEventListener('click',()=>{
        addEventWrapper.classList.remove('active');
    })
    // click outside to close the event Wrapper
    document.addEventListener('click', (e)=>{
        // click outside
        if(e.target !== addEvent && !addEventWrapper.contains(e.target)){
            addEventWrapper.classList.remove('active');
        }
    });
    // allow only 50chars in title
    eventTitle.addEventListener('input', (e)=>{
        eventTitle.value = eventTitle.value.slice(0, 50);
    })
    // time format in from and to time
    // FROM TIME
    eventTimeFrom.addEventListener('input', (e)=>{
        // remove anything else than numbers 
        eventTimeFrom.value = eventTimeFrom.value.replace(/[^0-9]/g, '');
        // 
        if (eventTimeFrom.value.length >= 2) {
        // Add a colon after the second character if not already present
            if (eventTimeFrom.value.charAt(2) !== ':') {
                }eventTimeFrom.value = eventTimeFrom.value.slice(0, 2) + ":" + eventTimeFrom.value.slice(2);
            }
        // user should not enter more that five chars 
        if (eventTimeFrom.length >5){
            eventTimeFrom.value = eventTimeFrom.value.slice(0,5);
        }
    });
    // TO TIME
    eventTimeTo.addEventListener('input', (e)=>{
        // remove anything else than numbers 
        eventTimeTo.value = eventTimeTo.value.replace(/[^0-9]/g, '');
        // 
        if (eventTimeTo.value.length >= 2) {
        // Add a colon after the second character if not already present
            if (eventTimeTo.value.charAt(2) !== ':') {
                }eventTimeTo.value = eventTimeTo.value.slice(0, 2) + ":" + eventTimeTo.value.slice(2);
            }
        // user should not enter more that five chars 
        if (eventTimeTo.length >5){
            eventTimeTo.value = eventTimeTo.value.slice(0,5);
        }
    });

// function to add listener on days after rendered
    function addListener(){
        const days = document.querySelectorAll('.day');

        days.forEach((day)=>{
            day.addEventListener('click', (e)=>{
                // set current day as active day
                activeDay = Number(e.target.innerHTML);
                // call getActiveDay function after click
                getActiveDay(e.target.innerHTML);
                // call updateEvents function after day clicked
                updateEvents(e.target.innerHTML);
                //remove active
                days.forEach((day) => {
                    day.classList.remove("active");
                });
        
                // if prev month clicked go to prev month and add active 
                if(e.target.classList.contains('prev-date')){
                    prevMonths();

                    setTimeout(()=>{
                        // select all days of that month 
                        const days = document.querySelectorAll('.day');
                        // after going to the prev month add active class to the clicked
                        days.forEach(day=>{
                            if(
                                !day.classList.contains('prev-date') && day.innerHTML === e.target.innerHTML
                            ){
                                day.classList.add('active');
                            }
                            })
                        }, 100);
                    }
                    // same with next month
                else if(e.target.classList.contains('next-date')){
                        nextMonths();
                
                        setTimeout(()=>{
                            // select all days of that month 
                            const days = document.querySelectorAll('.day');
                            // after going to the next month add active class to the clicked
                            days.forEach(day=>{
                                if(
                                    !day.classList.contains('next-date') && day.innerHTML === e.target.innerHTML
                                ){
                                    day.classList.add('active');
                                }
                                })
                            }, 100);
                    }
                    // the remaining month days
                else{
                    e.target.classList.add('active');
                }
            });
        });
    }
    // get and show active day events 
    const eventDay = document.querySelector('.event-day');
    const eventDate = document.querySelector('.event-date');
    const getActiveDay = (date)=>{        
        let day = new Date(year,month,date);
        let dayName = day.toString().split(" ")[0];
        eventDay.innerHTML = dayName;
        eventDate.innerHTML = date + " " + months[month] +" " + year;
    }
    

    // UPDATE  the events function 
    const eventsContainer = document.querySelector('.events');
    // 
    const updateEvents = (date) => {
        let eventsHTML = '';
        console.log(date);
        eventsArr.forEach(event => {
            console.log(event);
          if (
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
          ) {
            event.events.forEach(singleEvent => {
              eventsHTML += `
                <div class="event relative w-[95%] h-[70px] flex justify-center flex-col space-x-[5px] color-white px-[20px] pl-[50px] cursor-pointer bg-gradient-to-r from-yellow-400 to-transparent">
                  <div class="title flex items-center pointer-events-none">
                    <i class="fas fa-circle"></i>
                    <h3 class="event-title text-base ml-[20px]">${singleEvent.title}</h3>
                  </div>
                  <div class="event-time text-sm font-normal pointer-events-none ml-[5px]">
                    ${singleEvent.time}
                  </div>
                </div>
              `;
            });
          }
        });      
        if (eventsHTML === '') {
          eventsHTML += `
            <div class="no-event">
              <h3 class="semibold text-xl text-center">No Events</h3>
            </div>
          `;
        }
      
        eventsContainer.innerHTML = eventsHTML;
        saveEvents();
      };
    //   updateEvents();
    // // Call the functions that rely on updateEvents, AFTER it's defined
    initCalendar();

    // Function to add events to  eventsArr
    // const eventTitle =document.querySelector('.event-name')
    document.querySelector('.add-event-btn').addEventListener('click', (e)=>{
        const eventName = eventTitle.value
        const eventStart =eventTimeFrom.value;
        const eventEnd = eventTimeTo.value;
        // some validations
        if(eventName == ""||eventStart==""||eventEnd==""){
            alert('no empty form fields')
        }

        const timeFromArr = eventStart.split(":");
        const timeToArr = eventEnd.split(':');

        if(timeFromArr.length !== 2 || timeToArr.length !== 2 ||
            timeFromArr [0]> 23 || timeFromArr[1] > 59 ||
            timeToArr [0]> 23 || timeToArr[1] > 59 ){
                alert('Invalid Time Format')
            }

        const timeFrom = convertTime(eventStart);
        const timeTo = convertTime(eventEnd);

        const newEvent = {
            title:eventName,
            time: timeFrom + '-' + timeTo
        }

        let eventAdded = false;

        // check if eventsArr not empty 
        if(eventsArr.length > 0 ){
            // check if current day has already any event then add to that
            eventsArr.forEach(item => {
                if(
                    item.day === activeDay &&
                    item.month === month + 1 &&
                    item.year === year
                ){
                    item.events.push(newEvent)
                    eventAdded = true;
                }
            })
        }

        // if eventArr empty or current day has no event create new 
        if(!eventAdded){
            eventsArr.push(
                {
                day:activeDay,
                month:month + 1,
                year:year,
                events:[newEvent]
                }
            )
        }
        console.log(eventsArr);
        // remove active from add event from 
        eventsContainer.classList.remove('active')
        // clear the fields 
        eventTitle.value="";
        eventTimeFrom.value="";
        eventTimeTo.value="";
        // show current added event

        updateEvents(activeDay);

        // also add event class to newly added day if not already
    });

    const convertTime =(time)=>{
        let timeArr = time.split(':');
        let timeHour = timeArr[0];
        let timeMin = timeArr[1];
        let timeFormat = timeHour >=12 ?'PM' : 'AM';
        timeHour = timeHour % 12 || 12;
        time = timeHour + ":" + timeMin + ":" + timeFormat;
        return time;
    }

    // function to remove events on click 
    eventsContainer.addEventListener('click', (e)=>{
        if(e.target.classList.contains('events')){
            console.log(e.target.children[0].children[1]);
            if (confirm("Are you sure you want to delete this event?")) {
            const eventTitle =  e.target.children[0].children[1].innerHTML;
            // get the title of the event then search in an array by title and delete
            eventsArr.forEach(event => {
                if(
                event.day === activeDay &&
                event.month === month + 1 &&
                year === year 
                ){
                event.events.forEach(item, index=>{
                    if(item.title === eventTitle){
                        event.events.splice(index, 1)
                    }
                });
                // if no event remaining on that date  remove complete day 
                if(event.events.length === 0){
                    eventsArr.splice(eventsArr.indexOf(event), 1);
                    // after remove complete day
                    const activeDayEl= document.querySelector('.day.active');
                    if (activeDayEl.classList.contains("event")) {
                    activeDayEl.classList.remove("event");
                  }
                }
              }
            });
            updateEvents(activeDay);
          }
        }
    });

    //function to save events in local storage
    function saveEvents() {
        localStorage.setItem("events", JSON.stringify(eventsArr));
    }
    
    //function to get events from local storage
    function getEvents() {
        //check if events are already saved in local storage then return event else nothing
        if (localStorage.getItem("events") === null) {
        return;
        }
        eventsArr.push(...JSON.parse(localStorage.getItem("events")));
    }
});