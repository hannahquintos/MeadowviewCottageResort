import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function singleActivity() {
  const [activity, setActivity] = useState([]);

  const params = useParams();

  useEffect(() => {
    const getSingleActivity = async () => {
      let response = await fetch(`http://localhost:3000/api/activities/${params.id}`);
      let data = await response.json();
      setActivity(data);
    }
    // console.log("params:" + params.id);
    
    getSingleActivity(params.id);
  }, []);

  return (
    <div className="detailsContainer">
        <div className="detailsContent">
            <div>
                <img className="detailsImg" src={activity.image} alt={activity.activityName} />
            </div>
            <div className="detailsInfo">
                <p className="detailsDate">{activity.startTime}</p>
                <h1>{activity.activityName}</h1>
                <div className="location">
                    <img src="../src/assets/location-icon.svg" alt="" />
                    <p>{activity.location}</p>
                </div>
                <p>{activity.description}</p>
                <div className="btn"><Link to="/">Register</Link></div>
            </div>
        </div>
    </div>
  );
}