import React from 'react';

function Heading() {
  return (
    <>
      <p className="heading-info-text">
        Select the source table and fields to filter. Then click{' '}
        <span className="font-size-600">Download Table</span>. Click{' '}
        <span className="font-size-600">Refresh</span> to re-extract your data.
      </p>
    </>
  );
}

export default Heading;
