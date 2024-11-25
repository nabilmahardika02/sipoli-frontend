import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  link: string;
  size: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ link, size }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    // Generate QR Code and set as a data URL
    QRCode.toDataURL(link, { width: size, margin: 1 }, (error, url) => {
      if (error) {
        console.error('Error generating QR Code:', error);
      } else {
        setQrCodeUrl(url);
      }
    });
  }, [link]);

  return (
    <div>
      {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code" /> : <p>Loading...</p>}
    </div>
  );
};

export default QRCodeGenerator;
