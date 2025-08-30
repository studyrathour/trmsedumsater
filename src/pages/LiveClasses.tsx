import React from 'react';

const LiveClasses: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="w-full h-screen">
        <iframe 
          src="https://irsion-10-0-hq44-alphaproject.netlify.app/" 
          width="100%" 
          height="100%" 
          frameBorder="0"
          className="w-full h-full"
          title="Live Classes"
          style={{
            border: 'none',
            outline: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default LiveClasses;
