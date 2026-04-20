import React, { useEffect, useRef } from 'react';
import QRCodeStyling from "qr-code-styling";

const QRVisual = ({ options, size = 200 }) => {
  const containerRef = useRef(null);
  const qrCodeInstance = useRef(null);

  useEffect(() => {
    qrCodeInstance.current = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: options.url || "https://qrlyze.io",
      dotsOptions: { color: options.color || "#000000", type: options.dotType || "square" },
      backgroundOptions: { color: options.bgColor || "#ffffff" },
      cornersSquareOptions: { color: options.color || "#000000", type: options.eyeType || "square" },
      imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: options.logoSize || 0.4 }
    });
    if (containerRef.current) {
      containerRef.current.innerHTML = ""; 
      qrCodeInstance.current.append(containerRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.update({
        data: options.url,
        dotsOptions: { color: options.color, type: options.dotType },
        backgroundOptions: { color: options.bgColor },
        cornersSquareOptions: { color: options.color, type: options.eyeType },
        cornersDotOptions: { color: options.color, type: options.eyeType },
        image: options.logo || "",
        imageOptions: { imageSize: options.logoSize || 0.4 }
      });
    }
  }, [options]);

  return <div ref={containerRef} className="flex justify-center items-center rounded-2xl bg-white p-2 border shadow-inner" />;
};

export default QRVisual;