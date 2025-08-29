import React from 'react';

const Batches: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="w-full h-screen">
        <iframe 
          src="https://jsgfiuwgerfmsajdk.netlify.app" 
          width="100%" 
          height="100%" 
          frameBorder="0"
          className="w-full h-full"
          title="Batches"
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