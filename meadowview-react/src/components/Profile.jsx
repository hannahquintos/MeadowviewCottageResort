import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function singleUser() {
  const [user, setUser] = useState([]);

  const params = useParams();

  useEffect(() => {
    const getSingleUser = async () => {
      let response = await fetch(`http://localhost:3000/api/users/${params.id}`);
      let data = await response.json();
      setUser(data);
    }
    
    getSingleUser(params.id);
  }, []);

  return (
    <div className="border">
        <div className="content">
            <div>
                <h1>Profile</h1>
            </div>
            <div className="divider"></div>
            <div>
                <p><span className="bold">First Name:</span> {user.firstName}</p>
                <p><span className="bold">Last Name:</span> {user.lastName}</p>
                <p><span className="bold">Email:</span> {user.email}</p>
                <p><span className="bold">Phone Number:</span> {user.phone}</p>
            </div>
            <div className="actionBtns">
                  <div className="btn edit"><Link to={`/profile/${user._id}/edit`}>Edit</Link></div>
              </div>
        </div>
    </div>
  );
}