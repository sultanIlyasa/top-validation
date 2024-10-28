import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface ReCAPTCHAWrapperProps {
  sitekey: string;
  onChange: (token: string | null) => void;
  size?: "normal" | "compact" | "invisible";
}

const ReCAPTCHAWrapper: React.FC<ReCAPTCHAWrapperProps> = ({
  sitekey,
  onChange,
  size = "normal",
}) => {
  return (
    <div className="scale-75 md:scale-x-[80%] lg:scale-100">
      <ReCAPTCHA sitekey={sitekey} onChange={onChange} size={size} />
    </div>
  );
};

export default ReCAPTCHAWrapper;
