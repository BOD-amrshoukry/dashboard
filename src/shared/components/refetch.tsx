import { RotateCcw } from 'lucide-react';
import React from 'react';

const Refetch = ({ refetch }) => {
  return (
    <button onClick={refetch}>
      <RotateCcw />
    </button>
  );
};

export default Refetch;
