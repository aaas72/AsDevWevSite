import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full py-8 ">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4 p-4 items-start ">
            <div className="flex items-center space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                title="LinkedIn"
                className="text-[#C5C5C5] hover:text-white transition-colors duration-300"
              >
                <FaLinkedin size={24} aria-hidden="true" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                title="GitHub"
                className="text-[#C5C5C5] hover:text-white transition-colors duration-300"
              >
                <FaGithub size={24} aria-hidden="true" />
              </a>
            </div>
            <div className="text-sm text-[#C5C5C5]">
              © 2025 AS.DEV . ALL RIGHTS RESERVED.
            </div>
          </div>

          {/* القسم الثاني: سياسة الخصوصية ومعلومات المطور */}
          <div className="flex flex-col space-y-4 p-4 items-end">
            <a
              href="/privacy"
              className="text-sm text-[#C5C5C5] hover:text-white transition-colors duration-300"
            >
              PRIVACY POLICY
            </a>
            <div className="text-sm text-[#C5C5C5]">
              DEVELOPED BY ABDELLAH S.DEV
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
