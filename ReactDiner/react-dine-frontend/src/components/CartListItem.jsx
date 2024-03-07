/* eslint-disable react/prop-types */

import { useContext } from "react";
import "./CartListItem.css";
import { CartContext } from "../../contexts/CartContext";

const CartListItem = ({ item }) => {
  const { addItemToCart, removeItemFromCart } = useContext(CartContext);
  return (
    <div className="cartListItem">
      <div className="cartProduct">
        <img src={`http://localhost:5000/${item.image}`}></img>
        <div className="cartItemName">
          <h3>{item.name}</h3>
        </div>
      </div>
      <div className="itemPrice">{item.price}</div>
      <div className="cartQuantity">
        <button onClick={() => removeItemFromCart(item)}>-</button>
        <div className="count">{item.quantity}</div>
        <button onClick={() => addItemToCart(item)}>+</button>
      </div>
      <div className="totalPrice">
        {(item.quantity * item.price).toFixed(2)}
      </div>
    </div>
  );
};

export default CartListItem;
