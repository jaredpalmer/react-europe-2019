import React from 'react';

export const MyErrorComponent = ({ componentStack, error }) => (
  <div
    style={{
      backgroundColor: '#FDBBBC',
      color: '#870012',
      padding: '1rem',
    }}
  >
    <p>
      <strong>Oops! An error occured!</strong>
    </p>
    <p>Here’s what we know…</p>
    <p>
      <strong>Error:</strong> {error.toString()}
    </p>
    <p>
      <strong>Stacktrace:</strong> {componentStack}
    </p>
  </div>
);
