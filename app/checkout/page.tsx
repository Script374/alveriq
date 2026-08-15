"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { useCart } from "@/components/context/CartContext";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router =
    useRouter();

  const {
    cart,
    clearCart,
  } = useCart();

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    address,
    setAddress,
  ] = useState("");

  const [
    pincode,
    setPincode,
  ] = useState("");

  const [
    city,
    setCity,
  ] = useState("");

  const [
    state,
    setState,
  ] = useState("");

  const [
    paymentLoading,
    setPaymentLoading,
  ] = useState(false);

  const [
    pincodeLoading,
    setPincodeLoading,
  ] = useState(false);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<"online" | "cod">("online");

  // =================================
  // Razorpay Script
  // =================================

  useEffect(() => {
    const existing =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existing) {
      return;
    }

    const script =
      document.createElement(
        "script"
      );

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(
      script
    );

    return () => {
      script.remove();
    };
  }, []);

  // =================================
  // Logged-in User
  // =================================

  useEffect(() => {
    const loadUser =
      async () => {
        try {
          const res =
            await fetch(
              "/api/auth/me",
              {
                cache:
                  "no-store",
              }
            );

          const data =
            await res.json();

          if (
            res.ok &&
            data.success &&
            data.user
          ) {
            setCustomerName(
              data.user.name ||
                ""
            );

            setEmail(
              data.user.email ||
                ""
            );
          }
        } catch (error) {
          console.error(
            "User fetch error:",
            error
          );
        }
      };

    loadUser();
  }, []);

  // =================================
  // Pincode → City / State
  // =================================

  useEffect(() => {
    if (
      pincode.length !== 6 ||
      !/^\d{6}$/.test(
        pincode
      )
    ) {
      setCity("");
      setState("");
      return;
    }

    const fetchPincode =
      async () => {
        try {
          setPincodeLoading(
            true
          );

          const res =
            await fetch(
              `https://api.postalpincode.in/pincode/${pincode}`
            );

          const data =
            await res.json();

          if (
            !Array.isArray(
              data
            ) ||
            !data[0] ||
            data[0].Status !==
              "Success"
          ) {
            setCity("");
            setState("");

            alert(
              "Invalid pincode"
            );

            return;
          }

          const office =
            data[0].PostOffice?.[0];

          if (!office) {
            setCity("");
            setState("");
            return;
          }

          setCity(
            office.District ||
              office.Block ||
              office.Name ||
              ""
          );

          setState(
            office.State ||
              ""
          );
        } catch (error) {
          console.error(
            "Pincode error:",
            error
          );
        } finally {
          setPincodeLoading(
            false
          );
        }
      };

    fetchPincode();
  }, [pincode]);

  // =================================
  // Price
  // =================================

  const subtotal =
    cart.reduce(
      (sum, item) =>
        sum +
        Number(
          item.price || 0
        ) *
          Number(
            item.quantity || 0
          ),
      0
    );

  const shipping =
    subtotal > 999
      ? 0
      : 99;

  const total =
    subtotal + shipping;

  // =================================
  // PLACE COD ORDER
  // =================================

  const handlePlaceCodOrder =
    async () => {
      try {
        setPaymentLoading(true);

        const res = await fetch(
          "/api/orders/cod",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              customerName:
                customerName.trim(),

              email:
                email.trim(),

              phone:
                phone.trim(),

              address:
                address.trim(),

              city:
                city.trim(),

              state:
                state.trim(),

              pincode:
                pincode.trim(),

              items:
                cart.map(
                  (item) => ({
                    id: item.id,

                    quantity:
                      Number(
                        item.quantity
                      ),

                    size:
                      item.size ||
                      "",
                  })
                ),
            }),
          }
        );

        const data =
          await res.json();

        console.log(
          "COD ORDER RESPONSE:",
          data
        );

        if (
          !res.ok ||
          !data.success ||
          !data.order ||
          !data.order.orderId
        ) {
          throw new Error(
            data.message ||
              "Failed to place order"
          );
        }

        clearCart();

        router.push(
          `/order-success?orderId=${encodeURIComponent(
            data.order.orderId
          )}`
        );
      } catch (error) {
        console.error(
          "COD Order Error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Unable to place order."
        );
      } finally {
        setPaymentLoading(false);
      }
    };

  // =================================
  // PLACE ORDER
  // =================================

  const handlePlaceOrder =
    async () => {
      if (
        !customerName.trim() ||
        !email.trim() ||
        !phone.trim() ||
        !address.trim() ||
        !pincode.trim() ||
        !city.trim() ||
        !state.trim()
      ) {
        alert(
          "Please fill all shipping details."
        );
        return;
      }

      if (
        !/^\d{6}$/.test(
          pincode.trim()
        )
      ) {
        alert(
          "Enter valid 6 digit pincode."
        );
        return;
      }

      if (cart.length === 0) {
        alert(
          "Your cart is empty."
        );
        return;
      }

      // =================================
      // COD — skip Razorpay entirely
      // =================================

      if (paymentMethod === "cod") {
        await handlePlaceCodOrder();
        return;
      }

      if (
        typeof window.Razorpay !==
        "function"
      ) {
        alert(
          "Payment system is loading. Please try again."
        );
        return;
      }

      try {
        setPaymentLoading(
          true
        );

        // =================================
        // 1. Create Razorpay Order
        // =================================

        const paymentRes =
          await fetch(
            "/api/payment",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  items:
                    cart.map(
                      (item) => ({
                        id:
                          item.id,

                        quantity:
                          Number(
                            item.quantity
                          ),

                        size:
                          item.size ||
                          "",
                      })
                    ),
                }),
            }
          );

        const paymentData =
          await paymentRes.json();

        if (
          !paymentRes.ok ||
          !paymentData.success ||
          !paymentData.id
        ) {
          throw new Error(
            paymentData.message ||
              "Failed to create payment order"
          );
        }

        // =================================
        // 2. Razorpay
        // =================================

        const options = {
          key:
            process.env
              .NEXT_PUBLIC_RAZORPAY_KEY_ID,

          amount:
            paymentData.amount,

          currency:
            paymentData.currency,

          name:
            "ALVERIQ",

          description:
            "ALVERIQ Order Payment",

          order_id:
            paymentData.id,

          prefill: {
            name:
              customerName.trim(),

            email:
              email.trim(),

            contact:
              phone.trim(),
          },

          handler:
            async (
              response: {
                razorpay_payment_id: string;
                razorpay_order_id: string;
                razorpay_signature: string;
              }
            ) => {
              try {
                // =================================
                // 3. Verify Payment
                // =================================

                const verifyRes =
                  await fetch(
                    "/api/payment/verify",
                    {
                      method:
                        "POST",

                      headers: {
                        "Content-Type":
                          "application/json",
                      },

                      body:
                        JSON.stringify({
                          razorpay_order_id:
                            response.razorpay_order_id,

                          razorpay_payment_id:
                            response.razorpay_payment_id,

                          razorpay_signature:
                            response.razorpay_signature,
                        }),
                    }
                  );

                const verifyData =
                  await verifyRes.json();

                if (
                  !verifyRes.ok ||
                  !verifyData.success
                ) {
                  throw new Error(
                    verifyData.message ||
                      "Payment verification failed"
                  );
                }

                // =================================
                // 4. Save Order
                // =================================

                const saveRes =
                  await fetch(
                    "/api/orders",
                    {
                      method:
                        "POST",

                      headers: {
                        "Content-Type":
                          "application/json",
                      },

                      body:
                        JSON.stringify({
                          customerName:
                            customerName.trim(),

                          email:
                            email.trim(),

                          phone:
                            phone.trim(),

                          address:
                            address.trim(),

                          city:
                            city.trim(),

                          state:
                            state.trim(),

                          pincode:
                            pincode.trim(),

                          // IMPORTANT:
                          // Use server verified items
                          items:
                            paymentData.items,

                          total:
                            paymentData.total,

                          paymentId:
                            response.razorpay_payment_id,

                          orderId:
                            response.razorpay_order_id,
                        }),
                    }
                  );

                const savedOrder =
                  await saveRes.json();

                console.log(
                  "SAVED ORDER:",
                  savedOrder
                );

                // =================================
                // 5. Check Order
                // =================================

                if (
                  !saveRes.ok ||
                  !savedOrder.success ||
                  !savedOrder.order ||
                  !savedOrder.order
                    .orderId
                ) {
                  throw new Error(
                    savedOrder.message ||
                      "Order ID was not returned"
                  );
                }

                const finalOrderId =
                  savedOrder.order
                    .orderId;

                console.log(
                  "FINAL ORDER ID:",
                  finalOrderId
                );

                // =================================
                // 6. Clear Cart
                // =================================

                clearCart();

                // =================================
                // 7. SUCCESS PAGE
                // =================================

                router.push(
                  `/order-success?orderId=${encodeURIComponent(
                    finalOrderId
                  )}`
                );
              } catch (error) {
                console.error(
                  "Payment / Order Error:",
                  error
                );

                alert(
                  error instanceof
                    Error
                    ? error.message
                    : "Payment successful, but order processing failed."
                );

                setPaymentLoading(
                  false
                );
              }
            },

          modal: {
            ondismiss:
              () => {
                setPaymentLoading(
                  false
                );
              },
          },

          theme: {
            color:
              "#6B2737",
          },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();
      } catch (error) {
        console.error(
          "Payment Error:",
          error
        );

        alert(
          error instanceof
            Error
            ? error.message
            : "Unable to start payment."
        );

        setPaymentLoading(
          false
        );
      }
    };

  // =================================
  // UI
  // =================================

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-16 bg-[var(--background)]">

        <h1 className="mb-12 text-center text-5xl">
          Checkout
        </h1>

        <div className="grid gap-10 lg:grid-cols-3">

          {/* =========================
              SHIPPING
          ========================== */}

          <section className="card p-8 lg:col-span-2">

            <h2 className="mb-8 text-2xl">
              Shipping Details
            </h2>

            <div className="space-y-6">

              <input
                type="text"
                placeholder="Full Name"
                value={
                  customerName
                }
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
                className="input"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="input"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                className="input"
              />

              <textarea
                rows={4}
                placeholder="House No., Street, Area / Full Address"
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                className="input"
              />

              {/* PINCODE */}

              <div>
                <label className="input-label">
                  Pincode
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6 digit pincode"
                  value={pincode}
                  onChange={(e) => {
                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setPincode(
                      value.slice(
                        0,
                        6
                      )
                    );
                  }}
                  className="input"
                />

                {pincodeLoading && (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Fetching city and state...
                  </p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                <input
                  type="text"
                  placeholder="City / District"
                  value={city}
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                  className="input bg-[var(--surface-sunken)]"
                />

                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) =>
                    setState(
                      e.target.value
                    )
                  }
                  className="input bg-[var(--surface-sunken)]"
                />

              </div>

            </div>
          </section>

          {/* =========================
              SUMMARY
          ========================== */}

          <section className="card p-8">

            <h2 className="mb-8 text-2xl">
              Order Summary
            </h2>

            <div className="space-y-4">

              {cart.map(
                (item) => (
                  <div
                    key={`${item.id}-${item.size || ""}`}
                    className="flex justify-between border-b border-[var(--border)] pb-4"
                  >
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {item.name}
                      </p>

                      <p className="text-sm text-[var(--muted)]">
                        Qty:{" "}
                        {item.quantity}
                      </p>

                      {item.size && (
                        <p className="text-sm text-[var(--muted)]">
                          Size:{" "}
                          {item.size}
                        </p>
                      )}
                    </div>

                    <p className="font-mono font-medium text-[var(--foreground)]">
                      ₹
                      {Number(
                        item.price
                      ) *
                        Number(
                          item.quantity
                        )}
                    </p>
                  </div>
                )
              )}

            </div>

            <div className="mt-8 space-y-4 border-t border-[var(--border)] pt-6">

              <div className="flex justify-between text-[var(--foreground)]">
                <span>
                  Subtotal
                </span>

                <span className="font-mono">
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex justify-between text-[var(--foreground)]">
                <span>
                  Shipping
                </span>

                <span className="font-mono">
                  {shipping ===
                  0
                    ? "FREE"
                    : `₹${shipping}`}
                </span>
              </div>

              <div className="flex justify-between border-t border-[var(--border)] pt-4 text-xl">
                <span className="font-medium text-[var(--foreground)]">
                  Total
                </span>

                <span className="font-mono font-medium text-[var(--foreground)]">
                  ₹{total}
                </span>
              </div>

            </div>

            {/* PAYMENT METHOD */}

            <div className="mt-8 border-t border-[var(--border)] pt-6">

              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                Payment Method
              </h3>

              <div className="space-y-3">

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border p-4 transition ${
                    paymentMethod === "online"
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--border-strong)] hover:border-[var(--accent)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "online"}
                    onChange={() =>
                      setPaymentMethod("online")
                    }
                    className="accent-[var(--accent)]"
                  />

                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      Online Payment
                    </p>

                    <p className="text-sm text-[var(--muted)]">
                      Pay securely via Razorpay
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border p-4 transition ${
                    paymentMethod === "cod"
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--border-strong)] hover:border-[var(--accent)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() =>
                      setPaymentMethod("cod")
                    }
                    className="accent-[var(--accent)]"
                  />

                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-[var(--muted)]">
                      Pay in cash when your order arrives
                    </p>
                  </div>
                </label>

              </div>

            </div>

            <button
              type="button"
              onClick={
                handlePlaceOrder
              }
              disabled={
                paymentLoading ||
                pincodeLoading ||
                cart.length === 0
              }
              className="btn btn-primary mt-8 w-full"
            >
              {paymentLoading
                ? paymentMethod === "cod"
                  ? "Placing Order..."
                  : "Processing..."
                : paymentMethod === "cod"
                ? "Place Order (COD)"
                : "Pay Now"}
            </button>

          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}