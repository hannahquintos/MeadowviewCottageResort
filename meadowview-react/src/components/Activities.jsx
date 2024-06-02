import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Weather from "./Weather";

export default function ActivitiesList() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const getAllActivities = async () => {
      let response = await fetch("http://localhost:3000/api/activities");
      let data = await response.json();
      setActivities(data);
    }
    getAllActivities();
  }, []);

  return (
    <div className="contentContainer">
      <div className="pageTitle">
        <h1>Activities</h1>
        <div className="btn"><Link to="/">View Registered Activities</Link></div>
      </div>
        {
          activities.map((activity) => (
            <Link to={`/activities/${activity._id}`} key={activity._id}>
                <div className="card">
                    <img src={activity.image} alt={activity.activityName} />
                    <div className="cardText">
                        <p>{activity.startTime}</p>
                        <h2>{activity.activityName}</h2>
                        <div className="location">
                            <img src="./src/assets/location-icon.svg" alt="" />
                            <p>{activity.location}</p>
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