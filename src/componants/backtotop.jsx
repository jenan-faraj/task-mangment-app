import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Button = () => {
  const [isVisible, setIsVisible] = useState(false);

  // التحقق من ظهور الزر بناءً على موضع التمرير
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // التمرير إلى أعلى الصفحة
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // لجعل التمرير سلسًا
    });
  };

  // إضافة مستمع لحدث التمرير
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <StyledWrapper style={{ display: isVisible ? "block" : "none" }}>
      <button className="button" onClick={scrollToTop}>
        <svg className="svgIcon" viewBox="0 0 384 512">
          <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
        </svg>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;

  .button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(
      to right,
      #075985,
      #0f766e
    ); /* من cyan-800 إلى teal-700 */
    border: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 0px 4px rgba(180, 160, 255, 0.253);
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
    position: relative;
  }

  .svgIcon {
    width: 12px;
    transition-duration: 0.3s;
  }

  .svgIcon path {
    fill: white;
  }

  .button:hover {
    width: 140px;
    border-radius: 50px;
    transition-duration: 0.3s;
    background: linear-gradient(
      to right,
      #075985,
      #0f766e
    ); /* التدرج اللوني يبقى كما هو عند التحويم */
    align-items: center;
  }

  .button:hover .svgIcon {
    transition-duration: 0.3s;
    transform: translateY(-200%);
  }

  .button::before {
    position: absolute;
    bottom: -20px;
    content: "Back to Top";
    color: white;
    font-size: 0px;
  }

  .button:hover::before {
    font-size: 13px;
    opacity: 1;
    bottom: unset;
    transition-duration: 0.3s;
  }
`;

export default Button;
