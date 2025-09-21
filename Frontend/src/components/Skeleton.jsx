import React from 'react';

const Skeleton = ({ h = '3', w = '24', lines = 1, gap="2"}) => {
  return (
    <div className={`flex flex-col gap-${gap}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <h1
          key={index}
          className={`h-${h} w-${w} min-w-24 rounded-md bg-neutral-600 animate-pulse transition-all`}
        >
          &nbsp;
        </h1>
      ))}
    </div>
  );
};

export default Skeleton;
