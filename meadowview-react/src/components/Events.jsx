import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Weather from "./Weather";
import useAuth from '../hooks/useAuth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from "axios";

export default function EventsList() {
  const { auth } = useAuth();
  const [events, setEvents] = useState([]);
  const [eventFavourites, setEventFavourites] = useState([]);

  useEffect(() => {
    const getAllEvents = async () => {
      let response = await fetch("https://meadowview-cottage-resort-api.vercel.app/api/events");
      let data = await response.json();
      setEvents(data);
    };
    getAllEvents();
  }, []);

  useEffect(() => {
    const getAllEventFavourites = async () => {
      let response = await fetch(`https://meadowview-cottage-resort-api.vercel.app/api/eventFavourites/${auth.userId}`);
      let data = await response.json();
      setEventFavourites(data);
    }
    getAllEventFavourites();
  }, []);

  const isEventFavourited = (eventId) => {
    return eventFavourites.some(favourite => favourite.eventId === eventId);
  };


  const toggleFavourite = async (eventId, e) => {

    //prevent from navigating to details page when clicking heart
    e.preventDefault();
    
    try {
      if (isEventFavourited(eventId)) {
        //remove from favourites
        const favouriteToDelete = eventFavourites.find(favourite => favourite.eventId === eventId);

        await axios.get(`https://meadowview-cottage-resort-api.vercel.app/api/eventFavourites/delete/${favouriteToDelete._id}`);

      } else {
        //add to favourites
        const formData = {
          eventId: eventId,
          userId: auth.userId
        };

        await axios.post("https://meadowview-cottage-resort-api.vercel.app/api/eventFavourites/create", formData);

      }
      //update eventFavourites after adding/removing
      const updatedEventFavourites = isEventFavourited(eventId)
        ? eventFavourites.filter(favourite => favourite.eventId !== eventId)
        : [...eventFavourites, { userId: auth.userId, eventId }];
      setEventFavourites(updatedEventFavourites);
    } catch (e) {
      console.error(e);
    }
  };

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
    <div className="contentContainer">
      <div className="pageTitle">
        <h1>Events</h1>
        <div className="btn"><Link to="/events/favourites">View Favourited Events</Link></div>
      </div>
      {
        events.map((event) => (
          <Link to={`/events/${event._id}`} key={event._id}>
            <div className="card">
              <img src={event.image} alt={event.eventName} />
              <div className="cardText">
                <p>{formatDate(event.startTime, event.endTime)}</p>
                <h2>{event.eventName}</h2>
                <div className="location special">
                  <LocationOnIcon/>
                  <p>{event.location}</p>
                </div>
                <div className="heart" onClick={(e) => toggleFavourite(event._id, e)}>             
                  {isEventFavourited(event._id) ? (
                    <FavoriteIcon className="heartIcon"/>
                  ) : (
                    <FavoriteBorderOutlinedIcon className="heartIcon"/>
                  )}
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