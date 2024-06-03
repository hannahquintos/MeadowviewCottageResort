import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Weather from "./Weather";

export default function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getAllEvents = async () => {
      let response = await fetch("http://localhost:3000/api/events");
      let data = await response.json();
      setEvents(data);
    }
    getAllEvents();
  }, []);

  return (
    <div className="contentContainer">
      <div className="pageTitle">
        <h1>Events</h1>
        <div className="btn"><Link to="/">View Favourited Events</Link></div>
      </div>
        {
          events.map((event) => (
            <Link to={`/events/${event._id}`} key={event._id}>
                <div className="card">
                    <img src={event.image} alt={event.eventName} />
                    <div className="cardText">
                        <p>{event.startTime}</p>
                        <h2>{event.eventName}</h2>
                        <div className="location special">
                            <img src="./src/assets/location-icon.svg" alt="" />
                            <p>{event.location}</p>
                        </div>
                        <div className="heart">
                            <img src="./src/assets/heart-icon.svg" alt="" />
                        </div>
                    </div>
                </div>
            </Link>
          ))
        }
        <Weather />
    </div>
  );
}