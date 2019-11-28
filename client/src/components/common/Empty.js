import React from 'react';
import empty from './empty.png';

export default () => {
  return (
    <div>
      <img
        src={empty}
        style={{ width: '300px', margin: 'auto', display: 'block' }}
        alt="Empty..."
      />
    </div>
  );
};
