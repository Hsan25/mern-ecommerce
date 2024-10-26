import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "faq",
};
const FAQ = () => {
  const questions = [
    {
      question: "How can I track my order?",
      answer:
        "You can track your order using the tracking link sent in your confirmation email.",
    },
    {
      question: "What is the return policy?",
      answer:
        "We accept returns within 30 days of purchase. Items must be in original condition.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to many countries worldwide. Shipping rates and times vary by location.",
    },
  ];

  return (
    <div className="sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Frequently Asked Questions
      </h1>

      <Accordion type="single" collapsible className="w-full">
        {questions.map((q, idx) => (
          <AccordionItem value={q.answer} key={idx}>
            <AccordionTrigger>{q.question}</AccordionTrigger>
            <AccordionContent>{q.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
