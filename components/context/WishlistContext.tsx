"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];

  addToWishlist: (item: WishlistItem) => void;

  removeFromWishlist: (id: string) => void;

  isInWishlist: (id: string) => boolean;
};

const WishlistContext =
  createContext<WishlistContextType | null>(null);

const WISHLIST_KEY = "alveriq-wishlist";

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlist, setWishlist] =
    useState<WishlistItem[]>([]);

  // =========================
  // LOAD WISHLIST
  // =========================

  useEffect(() => {
    try {
      const savedWishlist =
        localStorage.getItem(WISHLIST_KEY);

      if (!savedWishlist) return;

      const parsedWishlist =
        JSON.parse(savedWishlist);

      if (Array.isArray(parsedWishlist)) {
        setWishlist(parsedWishlist);
      }
    } catch (error) {
      console.error(
        "Wishlist Load Error:",
        error
      );
    }
  }, []);

  // =========================
  // SAVE WISHLIST
  // =========================

  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error(
        "Wishlist Save Error:",
        error
      );
    }
  }, [wishlist]);

  // =========================
  // ADD TO WISHLIST
  // =========================

  const addToWishlist = (
    item: WishlistItem
  ) => {
    if (!item.id) return;

    setWishlist((prev) => {
      const alreadyExists = prev.some(
        (wishlistItem) =>
          wishlistItem.id === item.id
      );

      if (alreadyExists) {
        return prev;
      }

      return [...prev, item];
    });
  };

  // =========================
  // REMOVE
  // =========================

  const removeFromWishlist = (
    id: string
  ) => {
    if (!id) return;

    setWishlist((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  // =========================
  // CHECK
  // =========================

  const isInWishlist = (
    id: string
  ) => {
    if (!id) return false;

    return wishlist.some(
      (item) => item.id === id
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// =========================
// HOOK
// =========================

export function useWishlist() {
  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}