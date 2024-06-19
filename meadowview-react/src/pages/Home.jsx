import { Link } from "react-router-dom";

export default function Home() {
  return(
    <>
        <div>
            <img src="./assets/muskoka-chairs.png" alt="Green and yellow muskoka chairs on a dock by the lake." />
        </div>
        <div className="contentWrapper">
            <div id="aboutContent">
                <div id="aboutText">
                    <h1>Escape to the Lake</h1>
                    <p>Welcome to Meadowview Cottage Resort, your perfect retreat located on Kahshe Lake in Muskoka, Ontario. At Meadowview, we offer a perfect blend of rustic charm and modern comfort, providing cozy cottages, engaging outdoor activities, and breathtaking views. Whether you're looking to unwind by the campfire, explore scenic hiking trails, or enjoy a leisurely pontoon boat ride, our resort is the ideal destination for families, couples, and adventure seekers. Experience the beauty of nature and the warmth of our hospitality at Meadowview Cottage Resort, where unforgettable memories are made.</p>
                </div>
            </div>
            <div id="gallery">
                <img src="./assets/red-canoe.png" alt="" />
                <img src=".assets/fishing.png" alt="" />
                <img src="./assets/trampoline.png" alt="" />
            </div>
        </div>
    </>
  );
}