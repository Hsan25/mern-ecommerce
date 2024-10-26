import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms-conditions",
};

const TermsConditionsPage = () => {
  return (
    <div className="sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Terms and Conditions
      </h1>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p className="text-gray-700 text-sm">
          By accessing our website and making a purchase, you agree to the terms
          and conditions outlined here.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">2. Orders</h2>
        <p className="text-gray-700 text-sm">
          All orders are subject to availability and confirmation of payment. We
          reserve the right to cancel or modify orders as necessary.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">3. Pricing and Payment</h2>
        <p className="text-gray-700 text-sm">
          Prices are listed in your local currency and include applicable taxes.
          Payment must be made at checkout.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">4. Returns and Refunds</h2>
        <p className="text-gray-700 text-sm">
          Returns are accepted within 30 days of purchase. Refunds will be
          issued to the original payment method.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">5. Liability</h2>
        <p className="text-gray-700 text-sm">
          Our liability is limited to the purchase price of the item. We are not
          responsible for indirect losses resulting from the use of our site.
        </p>
      </section>

      <p className="text-center text-gray-500 mt-6">
        Effective Date: October 24, 2024
      </p>
    </div>
  );
};

export default TermsConditionsPage;
