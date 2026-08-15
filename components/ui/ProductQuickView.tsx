"use client";

import Image from "next/image";
import { X, Heart, ShoppingBag } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  name: string;
  price: number;
  image: string;
};

export default function ProductQuickView({
  open,
  onClose,
  name,
  price,
  image,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="relative w-full max-w-5xl rounded-3xl bg-white">

        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10"
        >
          <X />
        </button>

        <div className="grid md:grid-cols-2">

          <div className="relative aspect-square">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
              className="rounded-l-3xl object-cover"
            />
          </div>

          <div className="p-10">

            <h2 className="text-4xl font-bold">
              {name}
            </h2>

            <p className="mt-4 text-3xl font-semibold">
              ₹{price}
            </p>

            <p className="mt-6 text-gray-600">
              Premium fabric.
              Luxury fit.
              Designed for modern everyday wear.
            </p>

            <h3 className="mt-8 mb-3 font-semibold">
              Select Size
            </h3>

            <div className="flex gap-3">

              <button className="rounded border px-5 py-3">S</button>
              <button className="rounded border px-5 py-3">M</button>
              <button className="rounded border px-5 py-3">L</button>
              <button className="rounded border px-5 py-3">XL</button>

            </div>

            <div className="mt-10 flex gap-4">

              <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black py-4 text-white">
                <ShoppingBag size={20}/>
                Add To Cart
              </button>

              <button className="rounded-full border p-4">
                <Heart/>
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}