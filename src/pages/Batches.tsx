import React from 'react';

const Batches: React.FC = () => {
  const iframeUrl = "https://jsgfiuwgerfmsajdk.netlify.app";

  return (
    <div className="min-h-screen bg-gray-900 pb-20 md:pb-0">
      <div className="w-full h-screen">
        <iframe 
          src={iframeUrl}
          width="100%" 
          height="100%" 
          frameBorder="0"
          className="w-full h-full"
          title="Batches"
          loading="eager"
          style={{
            border: 'none',
            outline: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default Batches;