import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Weather from "./Weather";

export default function EquipmentList() {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const getAllEquipment = async () => {
      let response = await fetch("http://localhost:3000/api/equipment");
      let data = await response.json();
      setEquipment(data);
    }
    getAllEquipment();
  }, []);

  return (
    <div className="contentContainer">
      <div className="pageTitle">
        <h1>Equipment</h1>
        <div className="btn"><Link to="/">View Equipment Bookings</Link></div>
      </div>
      {
          equipment.map((equipmentPiece) => {

            //set text colour of availablity status
            var color;
            if (equipmentPiece.availability === "Available") {
              color = "colorAvailable";
            } else {
              color = "colorUnavailable";
            }

            return (
              <Link to={`/equipment/${equipmentPiece._id}`} key={equipmentPiece._id}>
                <div className="card">
                  <img src={equipmentPiece.image} alt={equipmentPiece.equipmentName} />
                  <div className="cardText">
                    <p className={color}>{equipmentPiece.availability}</p>
                    <h2>{equipmentPiece.equipmentName}</h2>
                    <p>{equipmentPiece.condition} Condition</p>
                  </div>
                </div>
              </Link>
            );
          })
      }
      <Weather />
    </div>
  );
}