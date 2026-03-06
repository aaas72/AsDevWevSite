import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";

interface PageHeaderProps {
  title: string;
  question?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, question }) => {
  const location = useLocation();

  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  return (
    <section>
      <header
        className="relative w-full h-[350px] pt-28 pb-8"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px",
        }}
      >
        <div className="container mx-auto px-6 mt-24">
          <div className="container mx-auto mt-8 mb-12">
            <div className="flex justify-between items-center">
              <h1 className="text-5xl font-medium text-[#C5C5C5]">{title}</h1>

              {question && <span className="text-[#C5C5C5]">{question}</span>}
            </div>
          </div>
          <div className="flex items-center text-sm text-[#C5C5C5]">
            <Link
              to="/"
              className="flex items-center hover:text-white transition-colors duration-300"
            >
              <FaHome className="mr-2" /> Home
            </Link>

            {pathSegments.map((segment, index) => (
              <React.Fragment key={index}>
                <span className="mx-2">.</span>
                <Link
                  to={`/${pathSegments.slice(0, index + 1).join("/")}`}
                  className="capitalize hover:text-white transition-colors duration-300"
                >
                  {segment}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>
    </section>
  );
};

export default PageHeader;
