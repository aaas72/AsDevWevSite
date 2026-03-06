import React from "react";
// استيراد مكونات Calendly
import { InlineWidget } from "react-calendly";

const ConsultationForm: React.FC = () => {
  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <h2 className="text-xl sm:text-2xl font-medium text-[#1E1E1E] mb-3 sm:mb-4">
        Schedule A Consultation
      </h2>
      <p className="text-[#474747] mb-4 sm:mb-6 text-xs sm:text-sm text-center max-w-md mx-auto">
        Ready To Start Your Project? Book A Free Consultation Call To Discuss
        Your Ideas, Requirements, And How We Can Bring Your Vision To Life.
      </p>

      {/* Calendly Inline Widget */}
      <div className="mb-6 sm:mb-8 border w-full sm:w-[90%] md:w-[95%] lg:w-[800px] border-[#E0E0E0] rounded-lg overflow-hidden">
        <InlineWidget
          url="https://calendly.com/your_scheduling_page" // استبدل هذا برابط Calendly الخاص بك
          styles={{
            height: "500px",
            minHeight: "350px",
            maxHeight: "650px",
            boxShadow: "none",
            width: "100%",
          }}
          pageSettings={{
            backgroundColor: "ffffff",
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
            primaryColor: "4f46e5",
            textColor: "333333",
          }}
          prefill={{
            name: "",
            email: "",
            customAnswers: {
              a1: "Website Development",
            },
          }}
        />
      </div>
    </div>
  );
};

export default ConsultationForm;
