import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy-policy",
};

const PrivacyPolicyPage = () => {
  return (
    <div className="sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Privacy Policy
      </h1>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          1. Information Collection
        </h2>
        <p className="text-gray-700 text-sm">
          We collect information when you visit our website, place an order, or
          create an account. This includes personal information, such as your
          name, email address, and payment information.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">2. Use of Information</h2>
        <p className="text-gray-700 text-sm">
          The information we collect is used to process orders, improve our
          website, and communicate with you about updates, promotions, and
          customer support.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
        <p className="text-gray-700 text-sm">
          We do not sell or trade your information. We may share information
          with trusted partners for the purpose of delivering our services,
          complying with legal obligations, or protecting our rights.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">4. Cookies</h2>
        <p className="text-gray-700 text-sm">
          Our website uses cookies to enhance your experience, gather general
          visitor information, and track visits. You may disable cookies in your
          browser, but some features of our website may not function properly
          without them.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">5. Security</h2>
        <p className="text-gray-700 text-sm">
          We take reasonable measures to protect your information. However, we
          cannot guarantee the absolute security of your data transmitted
          online.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
        <p className="text-gray-700 text-sm">
          You have the right to access, update, or delete your personal
          information. Contact us if you wish to exercise any of these rights.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">7. Changes to Our Policy</h2>
        <p className="text-gray-700 text-sm">
          We may update this privacy policy from time to time. Changes will be
          posted on this page, and we encourage you to review it periodically.
        </p>
      </section>

      <p className="text-center text-gray-500 mt-6">
        Effective Date: October 24, 2024
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
