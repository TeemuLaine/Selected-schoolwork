import { Link, useLocation } from "react-router-dom";
import Popup from "../components/Popup";
import { useEffect, useState } from "react";
import "./Home.css";

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  const location = useLocation();

  // Checks if we arrive from checkout, to handle the pop-up.
  const pageState = location.state?.fromCheckout;

  useEffect(() => {
    if (pageState) {
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    }
  }, [pageState]);

  return (
    <>
      <div className="homeScreen">
        <h1>ReactDine</h1>
        <h2>Online ordering system for the React Diner</h2>
        <hr></hr>
        <p>
          Welcome to ReactDine! Start your order by clicking on the
          images below, or select <Link to="/products">Menu</Link> from the top
          bar!
        </p>
        <Link to="/products">
          <div className="images">
            <img src={`http://localhost:5000/images/mac-and-cheese.jpg`}></img>
            <img src={`http://localhost:5000/images/veggie-burger.jpg`}></img>
            <img
              src={`http://localhost:5000/images/sushi-roll-platter.jpg`}
            ></img>
          </div>
        </Link>

        {showPopup && (
          <Popup
            className="popup-add"
            message={"Order sent!"}
            fromCheckout={true}
          ></Popup>
        )}
      </div>
    </>
  );
};

export default Home;
