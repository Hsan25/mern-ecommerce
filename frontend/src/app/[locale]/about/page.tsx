// components/AboutPage.js

import React from "react";

const AboutPage = () => {
  return (
    <div className="sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">About Galaxy Store</h1>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
        <p className="text-gray-100">
          Our mission is to provide high-quality products with exceptional
          customer service. We strive to bring you the best shopping experience
          possible.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Who We Are</h2>
        <p className="text-gray-100">
          Founded in 2024, our e-commerce store started with a small team and a
          big vision. Today, we are proud to serve customers all over the world.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Meet the Team</h2>
        <p className="text-gray-100">
          Our team is passionate about what we do. From our developers to our
          customer support staff, we are committed to helping you with any
          needs.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
        <p className="text-gray-100">
          If you have questions, please reach out to us at support@example.com.
          We look forward to hearing from you!
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
