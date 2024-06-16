import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from "axios";

export default function singleEvent() {
  const { auth } = useAuth();
  const [event, setEvent] = useState([]);
  const [eventFavourites, setEventFavourites] = useState([]);

  const params = useParams();

  useEffect(() => {
    const getSingleEvent = async () => {
      let response = await fetch(`http://localhost:3000/api/events/${params.id}`);
      let data = await response.json();
      setEvent(data);
    }
    // console.log("params:" + params.id);
    
    getSingleEvent(params.id);
  }, []);

  useEffect(() => {
    const getAllEventFavourites = async () => {
      let response = await fetch(`http://localhost:3000/api/eventFavourites/${auth.userId}`);
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

        await axios.get(`http://localhost:3000/api/eventFavourites/delete/${favouriteToDelete._id}`);

      } else {
        //add to favourites
        const formData = {
          eventId: eventId,
          userId: auth.userId
        };

        await axios.post("http://localhost:3000/api/eventFavourites/create", formData);

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

  return (
    <div className="border">
        <div className="detailsContent">
            <div>
                <img className="detailsImg" src={event.image} alt={event.eventName} />
            </div>
            <div className="detailsInfo">
                <p className="detailsDate">{event.startTime}</p>
                <h1>{event.eventName}</h1>
                <div className="location">
                    <LocationOnIcon />
                    <p>{event.location}</p>
                </div>
                <p>{event.description}</p>
                <div className="heart" onClick={(e) => toggleFavourite(event._id, e)}>             
                  {isEventFavourited(event._id) ? (
                    <FavoriteIcon/>
                  ) : (
                    <FavoriteBorderOutlinedIcon/>
                  )}
                </div>
            </div>
        </div>
    </div>
  );
}