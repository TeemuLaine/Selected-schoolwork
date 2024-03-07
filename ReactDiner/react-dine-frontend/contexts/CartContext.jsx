/* eslint-disable react/prop-types */
import { createContext, useCallback, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [order, setOrder] = useState([]);

  const saveCartItemsToLocalStorage = useCallback((items) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, []);

  // On mount, gets items from local storage into cart (if they exist)
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      try {
        const parsedCartItems = JSON.parse(storedCartItems);
        setCartItems(parsedCartItems);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  // Any time cart items are changed, save to local storage
  useEffect(() => {
    saveCartItemsToLocalStorage(cartItems);
  }, [cartItems, saveCartItemsToLocalStorage]);

  const addItemToCart = (item) => {
    setCartItems((prevItems) => {
      return [...prevItems, item];
    });
  };

  /* The cart can have multiple instances of the same item, so this method converts that into an order array where
    an item has a quantity instead of having duplicates. */
  const cartToOrder = useCallback(() => {
    const orderArray = cartItems.reduce((orderItem, currentItem) => {
      const existingItem = orderItem.find((item) => item.id === currentItem.id);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        orderItem.push({ ...currentItem, quantity: 1 });
      }

      return orderItem;
    }, []);

    setOrder(orderArray);
  }, [cartItems]);

  useEffect(() => {
    cartToOrder();
  }, [cartToOrder]);

  const clearCart = () => {
    setCartItems([]);
  };

  const removeItemFromCart = (itemToRemove) => {
    setCartItems((prevItems) => {
      // Instead of removing everything with the same id, just remove one instance
      let removed = false;
      /* Array.filter() iterates the array from the beginning, which can cause issues with
       eventually rendering the cart. If an item that was added earlier than another gets removed
       from the cart, the cart order changes. In order to prevent this, the array is reversed to
       iterate from the end, and then reversed back for the return statement. */
      const updatedCartItems = prevItems.reverse().filter((item) => {
        if (!removed && item.id === itemToRemove.id) {
          removed = true;
          return false;
        }
        return true;
      });
      return updatedCartItems.reverse();
    });
  };

  const contextValue = {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    order,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
