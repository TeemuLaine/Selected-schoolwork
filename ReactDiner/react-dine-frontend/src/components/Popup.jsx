/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import "./Popup.css";

const Popup = ({ message, className, fromCart, fromCheckout }) => {
  return (
    <div>
      <div className={className}>
        <p>{message}</p>
        {fromCheckout && <></>}
        {fromCart && (
          <Link to={"/Products"}>
            <button>Go to Products</button>
          </Link>
        )}
        {!fromCart && !fromCheckout && (
          <Link to={"/cart"}>
            <button>Go to cart</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Popup;
