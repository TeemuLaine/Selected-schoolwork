/* eslint-disable react/prop-types */
import "./ConfirmationModal.css";

const ConfirmationModal = ({
  total,
  show,
  handleSubmit,
  handleClose,
  orderData,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <section className="modal-main">
        <div className="orderInfo">
          {orderData.items[0].map((item) => (
            <p key={item.id}>
              {item.name} x {item.quantity}
            </p>
          ))}
          <h4>{total}€</h4>
        </div>
        <hr></hr>
        <div className="customerInfo">
          <p>{orderData.customer.name}</p>
          <p>{orderData.customer.street}</p>
          <p>
            {orderData.customer.postalCode} {orderData.customer.city}
          </p>
          <h4>Special instructions:</h4>
          <p>&quot;{orderData.customer.specialInfo}&quot;</p>
        </div>
        <hr></hr>
        <p>Confirm order?</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <button className="checkoutButton" onClick={handleSubmit}>
            Confirm
          </button>
          <button onClick={handleClose} className="closeButton">
            Close
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmationModal;
