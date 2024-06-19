import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Weather from "./Weather";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';

export default function ActivitiesList() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const getAllActivities = async () => {
      let response = await fetch("https://meadowview-cottage-resort.vercel.app/api/activities", {
        method: 'GET',
        credentials: 'include' // include cookies in the request
      })
      let data = await response.json();
      setActivities(data);
    }
    getAllActivities();
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
        <h1 className="adminHeading">Activities</h1>
        <div className="btn add">
            <Link to="/admin/activities/add">
            <div className="addContainer">
                Add Activity 
                <AddIcon/> 
            </div>
            </Link>
        </div>
      </div>
      <div className="contentContainer">
        {
          activities.map((activity) => (
            <Link to={`/admin/activities/${activity._id}`} key={activity._id}>
                <div className="card">
                    <img src={activity.image} alt={activity.activityName} />
                    <div className="cardText">
                        <p>{formatDate(activity.startTime, activity.endTime)}</p>
                        <h2>{activity.activityName}</h2>
                        <div className="location">
                            <LocationOnIcon/>
                            <p>{activity.location}</p>
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