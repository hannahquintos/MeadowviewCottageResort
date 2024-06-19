import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';

export default function EquipmentList() {
    const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const getAllEquipment = async () => {
      let response = await fetch("https://meadowview-cottage-resort-api.vercel.app/api/equipment");
      let data = await response.json();
      setEquipment(data);
    }
    getAllEquipment();
  }, []);

  return (
    <div className="adminList">
      <div className="adminListTitle">
        <h1 className="adminHeading">Equipment</h1>
        <div className="btn add">
            <Link to="/admin/equipment/add">
            <div className="addContainer">
                Add Equipment
                <AddIcon/> 
            </div>
            </Link>
        </div>
      </div>
      <div className="contentContainer">
      {
          equipment.map((equipmentPiece) => {

            //set text colour of availablity status
            let color;
            if (equipmentPiece.availability === "Available") {
              color = "colorAvailable";
            } else {
              color = "colorUnavailable";
            }

            return (
              <Link to={`/admin/equipment/${equipmentPiece._id}`} key={equipmentPiece._id}>
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
      </div>
    </div>
  );
}