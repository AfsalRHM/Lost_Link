import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import BotComponent from "./BotComponent";

const FaqPage = () => {
  const faqs = [
    {
      question: "What is LostLink?",
      answer:
        "LostLink is an innovative platform designed to help users find their missing belongings lost while traveling. Whether it’s a misplaced bag on a train, a phone left in a bus, or any valuable item lost in public places, LostLink connects users with finders to facilitate safe and secure recoveries.",
    },
    {
      question: "How to Put a Request?",
      answer:
        "To put a request, first you have to login in our website. After that simply create a lost item report by providing details such as item description, last-known location, and an optional image. You can choose to keep the request active for 1, 2, or 3 months before expiration.",
    },
    {
      question: "How can we Redeem a Request?",
      answer:
        "Once a finder reports having found your lost item, you will be notified. You can verify the item through images and chat before confirming retrieval. Upon successful recovery, the finder will earn reward points, and you can close the request.",
    },
    {
      question: "Where will the reward amount be credited?",
      answer:
        "Rewards for returning lost items will be credited to the finder's LostLink wallet. These points contribute to their tier progression and can be redeemed according to platform policies.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-2 bg-white rounded-full shadow-lg mb-6">
            <HelpCircle size={40} className="text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-indigo-600 text-lg max-w-2xl mx-auto">
            Find answers to common questions or chat with our support bot for
            personalized help
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-16 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "ring-2 ring-indigo-400"
                  : "hover:shadow-lg"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center"
              >
                <h3 className="font-semibold text-lg text-gray-800">
                  {faq.question}
                </h3>
                <div className="text-indigo-500 bg-indigo-50 p-2 rounded-full">
                  {openIndex === index ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </button>

              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 pb-5" : "max-h-0"
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <BotComponent />
      </div>
    </div>
  );
};

export default FaqPage;
