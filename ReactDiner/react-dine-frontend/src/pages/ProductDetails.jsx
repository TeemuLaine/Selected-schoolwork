import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [dish, setDish] = useState({});
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { addItemToCart, removeItemFromCart, cartItems } =
    useContext(CartContext);

  useEffect(() => {
    let itemCount = 0;
    for (const item of cartItems) {
      if (item.id === dish.id) {
        itemCount++;
      }
    }
    setCount(itemCount);
  }, [cartItems, dish]);

  // Using params, gets a specific product from the backend.
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:5000/api/dishes/${id}`)
      .then((res) => {
        setDish(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="productDetails">
          <div className="product">
            <img src={`http://localhost:5000/${dish.image}`}></img>
            <div className="productInfo">
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
            </div>
          </div>
          <div className="dishPrice">{dish.price}€</div>
          <div className="cartQuantity">
            <button onClick={() => removeItemFromCart(dish)}>-</button>
            <div className="count">{count}</div>
            <button onClick={() => addItemToCart(dish)}>+</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
