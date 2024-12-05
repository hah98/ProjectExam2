import React from "react";
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa'; // React Icons

const Footer = () => {
  return (
    <footer className="text-white py-4" style={{ backgroundColor: '#E8D46E' }}>
      <div className="container">
        {/* Section: Social Media */}
        <section className="text-center mb-4">
          <a className="btn btn-link text-white" href="#!" role="button">
            <FaFacebookF />
          </a>
          <a className="btn btn-link text-white" href="#!" role="button">
            <FaTwitter />
          </a>
          <a className="btn btn-link text-white" href="#!" role="button">
            <FaGoogle />
          </a>
          <a className="btn btn-link text-white" href="#!" role="button">
            <FaInstagram />
          </a>
          <a className="btn btn-link text-white" href="#!" role="button">
            <FaLinkedinIn />
          </a>
          <a className="btn btn-link text-white" href="#!" role="button">
            <FaGithub />
          </a>
        </section>

        {/* Copyright Section */}
        <div className="text-center mt-4">
          <p>© {new Date().getFullYear()} Holidaze</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
