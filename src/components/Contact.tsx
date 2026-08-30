import React, { useState } from "react";
import ConsultationForm from "./ConsultationForm";
import { FiChevronDown, FiSend } from "react-icons/fi";
import { messageService } from "../services";
import Button from "./Button";
import type { FAQ } from "../types";
import { useScrollReveal } from "../hooks";
import { ScrollReveal } from "./ScrollReveal/ScrollReveal";

const Contact: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { ref: sectionRef, isVisible, scrollDir } = useScrollReveal<HTMLElement>({
    threshold: 0.05,
    rootMargin: "-20px 0px -50px 0px",
  });

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

  const validateEmail = (email: string) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(String(email).toLowerCase())) return false;

    const [localPart, domain] = email.toLowerCase().split("@");
    
    // 1. Block common fake domains
    const fakeDomains = ["test.com", "example.com", "abc.com", "xyz.com", "mailinator.com", "tempmail.com"];
    if (fakeDomains.includes(domain)) return false;

    // 2. Detect Keyboard Mash (asdf, qwerty, zxcv, etc.)
    const mashPatterns = ["asdf", "sdfg", "dfgh", "ghjk", "jkl", "qwer", "wert", "erty", "rtyu", "tyui", "zxcv", "xcvb"];
    if (mashPatterns.some(p => localPart.includes(p))) return false;

    // 3. Detect repetitive characters (aaaa, 1111, etc.)
    if (/(.)\1{3,}/.test(localPart)) return false;

    // 4. Sanity check: length and vowels (prevent strings like "ghjkpt")
    if (localPart.length > 5 && !/[aeiouy0-9]/.test(localPart)) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid and active email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await messageService.send(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (submitError: any) {
      setError(submitError.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-6 py-4 bg-[#F9F9F9] border border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all duration-300 text-[#1A1A1A] text-sm placeholder:text-gray-300 font-medium";
  const labelClasses = "block text-[10px] uppercase tracking-[0.3em] font-bold text-[#919191] mb-2 ml-1";

  return (
    <section ref={sectionRef} data-theme="light" className="relative w-full py-8 sm:py-12 md:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollReveal.Header
          title="Let's Talk"
          badge="CONTACT"
          titleColor="text-[#1E1E1E]"
          badgeColor="text-[#919191]"
          isVisible={isVisible}
          scrollDir={scrollDir}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <ScrollReveal.Item
            index={0}
            totalColumns={2}
            isVisible={isVisible}
            scrollDir={scrollDir}
          >
            <div className="mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-8 tracking-tight">It's All Starts With Hello..</h3>
              
              {submitted ? (
                <div className="py-20 border-t border-b border-gray-100 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
                  <div className="space-y-2">
                    <h4 className="text-3xl font-bold text-[#1A1A1A] tracking-tighter uppercase">Message Received</h4>
                    <p className="text-[#666] text-lg font-medium">Your inquiry has been successfully logged. I will be in touch shortly.</p>
                  </div>
                  <Button 
                    variant="ghost"
                    theme="light"
                    onClick={() => setSubmitted(false)}
                    className="w-fit border-b border-black rounded-none pb-1 uppercase tracking-[0.3em] hover:text-[#919191] hover:border-[#919191] text-[10px]"
                  >
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="contactName" className={labelClasses}>Full Name</label>
                    <input 
                      type="text" 
                      id="contactName" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. John Doe" 
                      className={inputClasses}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contactEmail" className={labelClasses}>Email Address</label>
                    <input 
                      type="email" 
                      id="contactEmail" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="hello@example.com" 
                      className={inputClasses}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contactMessage" className={labelClasses}>Your Message</label>
                    <textarea 
                      id="contactMessage" 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="How can I help you?" 
                      rows={5}
                      className={`${inputClasses} resize-none`}
                    ></textarea>
                  </div>

                  {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>}

                  <Button 
                    type="submit"
                    disabled={loading}
                    variant="outline"
                    theme="light"
                    size="lg"
                    className="w-fit gap-3 uppercase tracking-[0.3em]"
                  >
                    {loading ? "Sending..." : "Send Message"} <FiSend className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              )}
            </div>
          </ScrollReveal.Item>
          
          <ScrollReveal.Item
            index={1}
            totalColumns={2}
            isVisible={isVisible}
            scrollDir={scrollDir}
          >
            <div className="p-10 rounded-[2.5rem] bg-[#F9F9F9] border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-2 tracking-tight">Frequently Asked Questions</h3>
              <p className="text-[#919191] mb-10 text-sm font-medium">
                Common inquiries regarding my process and services.
              </p>
              
              <div className="space-y-2">
                {faqs.map((faq) => (
                  <div key={faq.id} className="group">
                    <div 
                      className={`flex justify-between items-center cursor-pointer p-6 rounded-2xl transition-all duration-300 ${
                        openFaqId === faq.id ? "bg-white shadow-sm" : "hover:bg-white/50"
                      }`} 
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <h4 className="text-base font-bold text-[#1E1E1E] pr-4 tracking-tight">{faq.question}</h4>
                      <div className={`transition-transform duration-300 ${openFaqId === faq.id ? "rotate-180" : ""}`}>
                         <FiChevronDown className="text-[#1E1E1E]" />
                      </div>
                    </div>
                    {openFaqId === faq.id && (
                      <div className="px-6 pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-sm text-[#666] leading-relaxed font-medium">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal.Item>
        </div>
        
        <ScrollReveal.Item
          index={2}
          totalColumns={1}
          isVisible={isVisible}
          scrollDir={scrollDir}
          className="mt-16"
        >
          <ConsultationForm />
        </ScrollReveal.Item>
      </div>
    </section>
  );
};

export default Contact;