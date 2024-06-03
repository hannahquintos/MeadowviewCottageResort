import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function singleEquipment() {
  const [equipment, setEquipment] = useState([]);

  const params = useParams();

  useEffect(() => {
    const getSingleEquipment = async () => {
      let response = await fetch(`http://localhost:3000/api/equipment/${params.id}`);
      let data = await response.json();
      setEquipment(data);
    }
    // console.log("params:" + params.id);
    
    getSingleEquipment(params.id);
  }, []);

    //set text of availablity status
    var availability;
    var color;
    if (equipment.available === true) {
    availability = "Available";
    color = "colorAvailable";
    } else {
    availability = "Unavailable";
    color = "colorUnavailable";
    }

  return (
    <div className="border">
        <div className="detailsContent">
            <div>
                <img className="detailsImg" src={equipment.image} alt={equipment.equipmentName} />
            </div>
            <div className="detailsInfo">
                <p className={color} id="detailsAvailability">{availability}</p>
                <h1>{equipment.equipmentName}</h1>
                <p>{equipment.condition}</p>
                <p>{equipment.description}</p>
                <div className="btn"><Link to="/">Book</Link></div>
            </div>
        </div>
    </div>
  );
}