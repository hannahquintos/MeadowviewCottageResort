import ActivitiesList from "../components/Activities";
import { Link } from "react-router-dom";

export default function Activities() {
    return(
      <>
        <div className="contentWrapper">
            {/* <div className="pageTitle">
              <h1>Activities</h1>
              <div className="btn"><Link to="/">View Registered Activities</Link></div>
            </div> */}
            <ActivitiesList />
        </div>
      </>
    );
  }