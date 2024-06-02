import ActivitiesList from "../components/Activities";
import { Link } from "react-router-dom";

export default function Activities() {
    return(
      <>
        <div className="contentWrapper">
            <ActivitiesList />
        </div>
      </>
    );
  }