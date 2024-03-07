/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import "./ListItem.css";
import { CartContext } from "../../contexts/CartContext";
import Popup from "./Popup";

const ListItem = ({ dish }) => {
  const { addItemToCart, cartItems, removeItemFromCart } =
    useContext(CartContext);
  const [count, setCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [className, setClassName] = useState("");

  // Updates the count every time the cart gets updated (this serves as a workaround for item.quantity having issues).
  useEffect(() => {
    let itemCount = 0;
    for (const item of cartItems) {
      if (item.id === dish.id) {
        itemCount++;
      }
    }
    setCount(itemCount);
  }, [cartItems, dish]);

  const popUpHandler = () => {
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  const handleAddButtonClick = (event) => {
    event.preventDefault();
    addItemToCart(dish);
    setMessage("Item added!");
    setClassName("popup-add");
    popUpHandler();
    setCount(count + 1);
  };

  const handleRemoveButtonClick = (event) => {
    event.preventDefault();
    if (count > 0) {
      removeItemFromCart(dish);
      setMessage("Item removed!");
      setClassName("popup-remove");
      popUpHandler();
      setCount(count - 1);
    }
  };

  return (
    <div className="listItem">
      {" "}
      {showPopup && <Popup message={message} className={className} />}
      <div className="itemCartQuantity">
        <button onClick={(event) => handleRemoveButtonClick(event, dish)}>-</button>
        <div className="count">{count}</div>
        <button onClick={(event) => handleAddButtonClick(event, dish)}>+</button>
      </div>
      <img src={`http://localhost:5000/${dish.image}`}></img>
      <li>
        <p className="dishName">{dish.name}</p>
        <p className="dishPrice">{dish.price}€</p>
      </li>
    </div>
  );
};

export default ListItem;
