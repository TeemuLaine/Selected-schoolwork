import axios from "axios";
import { useEffect, useState } from "react";
import ListItem from "../components/ListItem";
import { Link } from "react-router-dom";
import "./Products.css";

const Products = () => {
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = () => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/dishes")
      .then((response) => {
        setDishes(response.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <h1>Products</h1>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <ul>
          <div className="productGrid">
            {dishes.map((dish) => (
              <Link to={`/Products/${dish.id}`} key={dish.id}>
                <div className="productContainer">
                  <ListItem key={dish.id} dish={dish}></ListItem>
                </div>
              </Link>
            ))}
          </div>
        </ul>
      )}
    </>
  );
};

export default Products;
