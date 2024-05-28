import Nav from "./Nav";

export default function Header() {
    return(
      <header>
        <div className="contentWrapper">
            <div id="headerContent">
                <div id="siteName">
                    <img src="./src/assets/meadowview-logo.svg" alt="" />
                    <h2><a href="/">Meadowview Cottage Resort</a></h2>
                </div>
                <Nav />
            </div>
        </div>
      </header>
    );
  }