import './App.css';
import { upcomingToday, upcomingTomorrow, upcomingNextWeek, upcomingThisWeek, getEvents } from './icsParser';

import React, { useState, useEffect } from 'react';



function App() {

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    fetch('https://calendar.google.com/calendar/ical/058c96a80a7765f5d396f2ae70e34a9ac9f3c354c7c6b434dc7880e0266f096f%40group.calendar.google.com/public/basic.ics')
      .then(response => response.text())
      .then(data => getEvents(data))
      .catch(error => console.error('Error loading ics file:', error));
  }, []);

  useEffect(
    () => {
      const timer = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString())
        
      
      }, 1000);
      return () => {
        clearInterval(timer)
      }
    },
    []
  );

  function formatCurrentTime(currentTime) {
    // split into hours, minutes, seconds
    const [hours, minutes, seconds] = currentTime.split(":");
    
    return (
      <div id="time">
        <span id="hours">{hours}</span>
        :
        <span id="minutes">{minutes}</span>
        :
        <span id="seconds">{seconds}</span>
      </div>
    );
  }

  function formatEventSummary(events, timecategory) {
    if (events.length > 0) {
      return (
        <div id={timecategory}>
          <h2>{timecategory}</h2>
          {events.map(event => (
            <p key={event.start}>
              {event.summary}
            </p>
          ))}
        </div>
      );
    }
    return null;

  }
  
  return (
    <div className="App">
      <h1>Welcome to Gymnastics!</h1>
      <div id="clock">{formatCurrentTime(currentTime)}</div>
      <div id="events">
        <div id="today">
        {formatEventSummary(upcomingToday(), "Today")}
        </div>
        <div id="tomorrow">
        {formatEventSummary(upcomingTomorrow(), "Tomorrow")}
        </div>
        <div id="thisweek">
        {formatEventSummary(upcomingThisWeek(), "This Week")}
        </div>
        <div id="nextweek">
        {formatEventSummary(upcomingNextWeek(), "Next Week")}
        </div>
      </div>
    </div>
  );
}



export default App;


