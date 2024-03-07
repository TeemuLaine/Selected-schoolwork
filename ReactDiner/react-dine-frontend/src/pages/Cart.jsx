import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import CartListItem from "../components/CartListItem";
import "./Checkout.css";
import { Link } from "react-router-dom";
import Popup from "../components/Popup";
import "./Cart.css";

const Cart = () => {
  const { order, clearCart } = useContext(CartContext);
  const [showPopup, setShowPopup] = useState(false);
  const [total, setTotal] = useState(0);

  // Any time the order is changed, update the total price of the cart.
  useEffect(() => {
    let total = 0;
    order.map((item) => {
      setTotal((total += item.quantity * item.price));
    });
  }, [order]);

  const popUpHandler = () => {
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  return (
    <div className="cartContainer">
      {order.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is currently empty</p>
          <button className="checkoutButton-inactive" onClick={popUpHandler}>
            To checkout
          </button>
          {showPopup && (
            <Popup
              fromCart={true}
              className={"popup-remove"}
              message={"Please add items to your cart"}
            />
          )}
        </div>
      ) : (
        <div>
          <div className="cartTitles">
            <h3 className="productName">Product</h3>
            <h3 className="price">Price</h3>
            <h3 className="quantity">Quantity</h3>
            <h3 className="total">Total</h3>
          </div>
          <div className="cart-items">
            {order.map((item) => (
              <CartListItem key={item.id} item={item} />
            ))}
          </div>
          <div
            style={{
              width: "40%",
              margin: "auto",
              marginRight: 0,
            }}
          >
            <div className="cartTotal">
              <p>Total price: {total.toFixed(2)}€</p>
            </div>
            <div className="cartSummary">
              <button className="clearButton" onClick={clearCart}>
                CLEAR CART
              </button>
              <Link to="/checkout">
                <button className="checkoutButton">TO CHECKOUT</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
