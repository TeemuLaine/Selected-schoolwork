import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import axios from "axios";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import ConfirmationModal from "../components/ConfirmationModal";

const Checkout = () => {
  const { order, clearCart } = useContext(CartContext);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    let total = 0;
    order.map((item) => {
      setTotal((total += item.quantity * item.price));
    });
  }, [order]);

  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [className, setClassName] = useState("");
  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState({});

  const nameRef = useRef();
  const streetRef = useRef();
  const postalCodeRef = useRef();
  const cityRef = useRef();
  const specialInfoRef = useRef();

  const openModal = (event) => {
    event.preventDefault();
    const orderData = {
      items: [order],
      customer: {
        specialInfo: specialInfoRef.current.value,
        name: nameRef.current.value,
        street: streetRef.current.value,
        postalCode: postalCodeRef.current.value,
        city: cityRef.current.value,
      },
    };
    if (
      orderData.customer.name &&
      orderData.customer.street &&
      orderData.customer.postalCode &&
      orderData.customer.city
    ) {
      setOrderData(orderData);
      setShowModal(true);
    } else {
      setMessage("Form data missing!");
      setClassName("popup-remove");
      popUpHandler();
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const popUpHandler = () => {
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:5000/api/orders", { order: orderData })
      .then((res) => {
        clearCart();
        navigate("/", { state: { fromCheckout: true } });
      })
      .catch((err) => {
        if (err.code === "ERR_BAD_REQUEST") {
          setMessage("Invalid form data!");
        } else {
          setMessage(err.message);
        }
        setClassName("popup-remove");
        popUpHandler();
        console.error(err);
      });
  };

  return (
    <div>
      <ConfirmationModal
        show={showModal}
        handleClose={closeModal}
        handleSubmit={handleSubmit}
        total={total}
        orderData={orderData}
      ></ConfirmationModal>
      {showPopup ? (
        <Popup
          className={className}
          fromCheckout={true}
          message={message}
        ></Popup>
      ) : (
        <></>
      )}
      <form className="product__form" onSubmit={openModal}>
        <div className="product__form__control">
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" ref={nameRef} />
        </div>
        <div className="product__form__control">
          <label htmlFor="streetName">Street name:</label>
          <input id="streetName" type="text" ref={streetRef} />
        </div>
        <div className="product__form__control">
          <label htmlFor="postalCode">Postal code:</label>
          <input id="postalCode" type="text" ref={postalCodeRef} />
        </div>
        <div className="product__form__control">
          <label htmlFor="city">City:</label>
          <input id="city" type="text" ref={cityRef} />
        </div>
        <div className="product__form__control">
          <label htmlFor="specialInfo">Special Instructions:</label>
          <input id="specialInfo" type="text" ref={specialInfoRef} />
        </div>
        <button type="submit" className="checkoutButton">
          Submit
        </button>
      </form>
    </div>
  );
};
export default Checkout;
