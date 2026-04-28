import React, { useEffect, useRef } from 'react';
import QRCodeStyling from "qr-code-styling";

const QRVisual = ({ options, size = 200, id }) => {
  const containerRef = useRef(null);
  const qrCodeInstance = useRef(null);

  useEffect(() => {
    qrCodeInstance.current = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: options.url || "https://qrlyze.io",
      dotsOptions: { 
        color: options.color || "#0F172A", 
        type: options.dotType || "square" 
      },
      backgroundOptions: { 
        color: options.bgColor || "#ffffff" 
      },
      cornersSquareOptions: { 
        color: options.color || "#0F172A", 
        type: options.eyeType || "square" 
      },
      cornersDotOptions: { 
        color: options.color || "#0F172A", 
        type: options.eyeType || "square" 
      },
      imageOptions: { 
        crossOrigin: "anonymous", 
        margin: 5, 
        imageSize: options.logoSize || 0.4 
      }
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = ""; 
      qrCodeInstance.current.append(containerRef.current);
    }
  }, [size]);

  useEffect(() => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.update({
        data: options.url || "https://qrlyze.io",
        dotsOptions: { color: options.color, type: options.dotType },
        backgroundOptions: { color: options.bgColor },
        cornersSquareOptions: { color: options.color, type: options.eyeType },
        cornersDotOptions: { color: options.color, type: options.eyeType },
        image: options.logo || "",
        imageOptions: { imageSize: options.logoSize || 0.4 }
      });
    }
  }, [options]);

  return (
    <div 
      id={id ? `qr-${id}` : undefined}
      ref={containerRef} 
      className="flex justify-center items-center rounded-3xl bg-white p-3 border border-slate-100 shadow-sm transition-all duration-300 relative overflow-hidden" 
    />
  );
};

export default QRVisual;