import { Link } from "react-router-dom";

export default function Home() {
  return(
    <>
        <div>
            <img src="/muskoka-chairs.png" alt="Green and yellow muskoka chairs on a dock by the lake" />
        </div>
        <div className="contentWrapper">
            <div id="aboutContent">
                <div id="aboutText">
                    <h1>Escape to the Lake</h1>
                    <p>Welcome to Meadowview Cottage Resort, your perfect retreat located on Kahshe Lake in Muskoka, Ontario. At Meadowview, we offer a perfect blend of rustic charm and modern comfort, providing cozy cottages, engaging outdoor activities, and breathtaking views. Whether you're looking to unwind by the campfire, explore scenic hiking trails, or enjoy a leisurely pontoon boat ride, our resort is the ideal destination for families, couples, and adventure seekers. Experience the beauty of nature and the warmth of our hospitality at Meadowview Cottage Resort, where unforgettable memories are made.</p>
                </div>
            </div>
            <div id="gallery">
                <img src="/red-canoe.png" alt="A red canoe sitting on the sand by the lake" />
                <img src="/fishing.png" alt="A father and son fishing on a dock" />
                <img src="/trampoline.png" alt="Kids jumping on a water trampoline" />
            </div>
        </div>
    </>
  );
}