
import * as ical from 'ical.js';


const URL = "https://calendar.google.com/calendar/ical/058c96a80a7765f5d396f2ae70e34a9ac9f3c354c7c6b434dc7880e0266f096f%40group.calendar.google.com/public/basic.ics"

// CORS proxy to bypass CORS restrictions
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

function getIcsData(url) {
    // Use CORS proxy to fetch the ICS file
    const proxiedUrl = CORS_PROXY + encodeURIComponent(url);
    
    return fetch(proxiedUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            return data;
        });
}

// read the ics file from the gist into allEvents
// if error, log and allEvents = []
let allEvents = [];

getIcsData(URL)
    .then(data => {
        console.log(data);
        allEvents = getEvents(data);
    })
    .catch(err => {
        console.log(err);
        allEvents = [];
    });

export function getEvents(icsData) {
    if (!icsData) {
        return [];
    }
    const data = icsData;
    const jcalData  = ical.parse(data);

    const comp = new ical.Component(jcalData);

    const vevents = comp.getAllSubcomponents("vevent");

    return vevents.map(vevent => {
        const event = new ical.Event(vevent);
        return {
            summary: event.summary,
            description: event.description,
            start: event.startDate.toString(),
            end: event.endDate.toString(),
        };
    });
  
}


function getEventsFromRange(start, end) {
    return allEvents.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= start && eventDate < end;
    });
}

export function upcomingToday() {
    const today = new Date();
    // truncate to midnight
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getEventsFromRange(today, tomorrow);
}

export function upcomingTomorrow() {
    const tomorrow = new Date();
    // truncate to midnight
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    return getEventsFromRange(tomorrow, dayAfterTomorrow);
}

export function upcomingThisWeek() {
    const thisWeekStart = new Date();
    // truncate to midnight
    thisWeekStart.setHours(0, 0, 0, 0);
    // exclude tomorrow
    thisWeekStart.setDate(thisWeekStart.getDate() + 2   );
    const startDate = thisWeekStart.getDate();
    const thisWeekEnd = new Date(thisWeekStart);
    // set to sunday of this week
    const daysUntilSunday = 7 - thisWeekStart.getDay();
    thisWeekEnd.setDate(thisWeekEnd.getDate() + daysUntilSunday);
    return getEventsFromRange(thisWeekStart, thisWeekEnd);
}

export function upcomingNextWeek() {
    const nextWeekStart = new Date();
    // truncate to midnight
    nextWeekStart.setHours(0, 0, 0, 0);
    const daysUntilMonday = 8 - nextWeekStart.getDay();
    nextWeekStart.setDate(nextWeekStart.getDate() + daysUntilMonday);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);
    return getEventsFromRange(nextWeekStart, nextWeekEnd);
}
