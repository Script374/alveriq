"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;

  increaseQuantity: (
    id: string,
    size?: string
  ) => void;

  decreaseQuantity: (
    id: string,
    size?: string
  ) => void;

  removeFromCart: (
    id: string,
    size?: string
  ) => void;

  clearCart: () => void;
};

const CartContext =
  createContext<CartContextType | null>(null);

const CART_KEY = "alveriq-cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] =
    useState<CartItem[]>([]);

  // =========================
  // LOAD CART
  // =========================

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(CART_KEY);

      if (!savedCart) return;

      const parsedCart =
        JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        setCart(parsedCart);
      }
    } catch (error) {
      console.error(
        "Cart Load Error:",
        error
      );
    }
  }, []);

  // =========================
  // SAVE CART
  // =========================

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Cart Save Error:",
        error
      );
    }
  }, [cart]);

  // =========================
  // MATCH CART ITEM
  // =========================

  const isSameItem = (
    item: CartItem,
    id: string,
    size?: string
  ) => {
    return (
      item.id === id &&
      (item.size || "") === (size || "")
    );
  };

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (item: CartItem) => {
    if (!item.id) return;

    setCart((prev) => {
      const existing = prev.find(
        (cartItem) =>
          isSameItem(
            cartItem,
            item.id,
            item.size
          )
      );

      if (existing) {
        return prev.map((cartItem) =>
          isSameItem(
            cartItem,
            item.id,
            item.size
          )
            ? {
                ...cartItem,
                quantity:
                  cartItem.quantity +
                  item.quantity,
              }
            : cartItem
        );
      }

      return [...prev, item];
    });
  };

  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQuantity = (
    id: string,
    size?: string
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        isSameItem(item, id, size)
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQuantity = (
    id: string,
    size?: string
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          isSameItem(item, id, size)
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // =========================
  // REMOVE ITEM
  // =========================

  const removeFromCart = (
    id: string,
    size?: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !isSameItem(item, id, size)
      )
    );
  };

  // =========================
  // CLEAR CART
  // =========================

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// =========================
// HOOK
// =========================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}