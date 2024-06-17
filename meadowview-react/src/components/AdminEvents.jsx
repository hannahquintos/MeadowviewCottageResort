import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';

export default function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getAllEvents = async () => {
      let response = await fetch("http://localhost:3000/api/events");
      let data = await response.json();
      setEvents(data);
    };
    getAllEvents();
  }, []);

  return (
    <div className="adminList">
      <div className="adminListTitle">
        <h1 className="adminHeading">Events</h1>
        <div className="btn add">
            <Link to="/admin/events/add">
            <div className="addContainer">
                Add Event
                <AddIcon/> 
            </div>
            </Link>
        </div>
      </div>
      <div className="contentContainer">
        {
          events.map((event) => (
            <Link to={`/admin/events/${event._id}`} key={event._id}>
                <div className="card">
                    <img src={event.image} alt={event.eventName} />
                    <div className="cardText">
                        <p>{event.startTime}</p>
                        <h2>{event.eventName}</h2>
                        <div className="location">
                            <LocationOnIcon/>
                            <p>{event.location}</p>
                        </div>
                    </div>
                </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}