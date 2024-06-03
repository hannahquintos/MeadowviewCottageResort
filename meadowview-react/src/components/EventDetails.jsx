import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function singleEvent() {
  const [event, setEvent] = useState([]);

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
                    <img src="../src/assets/location-icon.svg" alt="" />
                    <p>{event.location}</p>
                </div>
                <p>{event.description}</p>
                <div className="heart">
                  <img src="../src/assets/heart-icon.svg" alt="" />
                </div>
            </div>
        </div>
    </div>
  );
}