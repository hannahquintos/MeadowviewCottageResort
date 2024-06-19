import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      let response = await fetch("http://localhost:3000/api/users");
      let data = await response.json();
      setUsers(data);
    };
    getAllUsers();
  }, []);

  return (
    <div className="adminList">
      <div className="adminListTitle">
        <h1 className="adminHeading">User Accounts</h1>
        <div className="btn add">
            <Link to="/admin/users/add">
            <div className="addContainer">
                Add User
                <AddIcon/> 
            </div>
            </Link>
        </div>
      </div>
      <div className="contentContainer">
        {
          users
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((user) => (
            <Link to={`/admin/users/${user._id}`} key={user._id}>
                <div className="card">
                    <div className="cardText">
                        <h2>{user.lastName}, {user.firstName}</h2>
                        <p>{user.role}</p>
                    </div>
                </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}