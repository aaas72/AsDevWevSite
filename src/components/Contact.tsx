import React, { useState } from "react";
import ConsultationForm from "./ConsultationForm";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const Contact: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How do we start working together?",
      answer: "We begin with a consultation call to discuss your needs, followed by a proposal outlining scope, timeline, and cost."
    },
    {
      id: 2,
      question: "What is your pricing structure?",
      answer: "I offer project-based pricing determined by scope and complexity, as well as hourly rates for smaller tasks or ongoing support."
    },
    {
      id: 3,
      question: "How long does a typical project take?",
      answer: "Project timelines vary based on complexity, but I provide detailed estimates during our initial consultation."
    }
  ];

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section className="relative w-full py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-medium text-[#1E1E1E] mb-2 sm:mb-0">Let's Talk</h2>
          <span className="text-sm sm:text-base text-[#1E1E1E]">CONTACT</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          <div>
            <div className="mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-medium text-[#333333] mb-4 sm:mb-6">It's All Starts With Hello..</h3>
              
              <form className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="contactName" className="block text-sm text-[#555555] mb-2">Name</label>
                  <input 
                    type="text" 
                    id="contactName" 
                    placeholder="Enter Your Name" 
                    className="w-full p-2 sm:p-3 bg-transparent border border-[#CCCCCC] rounded-md text-[#555555] focus:outline-none focus:ring-1 focus:ring-[#333333]"
                  />
                </div>
                
                <div>
                  <label htmlFor="contactEmail" className="block text-sm text-[#555555] mb-2">Email</label>
                  <input 
                    type="email" 
                    id="contactEmail" 
                    placeholder="Enter Your Email" 
                    className="w-full p-2 sm:p-3 bg-transparent border border-[#CCCCCC] rounded-md text-[#555555] focus:outline-none focus:ring-1 focus:ring-[#333333]"
                  />
                </div>
                
                <div>
                  <label htmlFor="contactMessage" className="block text-sm text-[#555555] mb-2">Message</label>
                  <textarea 
                    id="contactMessage" 
                    placeholder="Enter Your Message" 
                    rows={4}
                    className="w-full p-2 sm:p-3 bg-transparent border border-[#CCCCCC] rounded-md text-[#555555] focus:outline-none focus:ring-1 focus:ring-[#333333]"
                  ></textarea>
                </div>
              </form>
            </div>
          </div>
          
          <div>
            <div className="p-4 sm:p-6 md:p-8 rounded-lg bg-[#FAFAFA] shadow-sm">
              <h3 className="text-xl sm:text-2xl font-medium text-[#1E1E1E] mb-3 sm:mb-6">Frequently Asked Questions</h3>
              <p className="text-[#919191] mb-3 sm:mb-4 text-xs sm:text-sm">
                Here Are The Answers To The Most Common Questions
              </p>
              
              <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-8">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border-b border-[#DDDDDD] pb-3 sm:pb-4">
                    <div 
                      className="flex justify-between items-center cursor-pointer py-2" 
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <h4 className="text-base sm:text-lg font-medium text-[#1E1E1E] pr-4">{faq.question}</h4>
                      {openFaqId === faq.id ? 
                        <FaChevronUp className="text-[#1E1E1E] flex-shrink-0" /> : 
                        <FaChevronDown className="text-[#1E1E1E] flex-shrink-0" />
                      }
                    </div>
                    {openFaqId === faq.id && (
                      <div className="overflow-hidden transition-all duration-300 ease-in-out">
                        <p className="text-xs sm:text-sm text-[#A0A0A0] mt-2 mb-3 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 sm:mt-16">
          <ConsultationForm />
        </div>
      </div>
    </section>
  );
};

export default Contact;