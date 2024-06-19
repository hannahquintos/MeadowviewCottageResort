import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';

export default function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getAllEvents = async () => {
      let response = await fetch("https://meadowview-cottage-resort-api.vercel.app/api/events");
      let data = await response.json();
      setEvents(data);
    };
    getAllEvents();
  }, []);

  const formatDate = (startTime, endTime) => {
    const date = { month: 'short', day: 'numeric' };
    const time = { hour: 'numeric', minute: 'numeric', hour12: true };

    const start= new Date(startTime);
    const end = new Date(endTime);

    const formattedDate = new Intl.DateTimeFormat('en-US', date).format(start);
    const formattedStartTime = new Intl.DateTimeFormat('en-US', time).format(start);
    const formattedEndTime = new Intl.DateTimeFormat('en-US', time).format(end);

    return `${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;
  };

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
                        <p>{formatDate(event.startTime, event.endTime)}</p>
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