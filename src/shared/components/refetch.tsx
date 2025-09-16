import { RotateCcw } from 'lucide-react';
import React from 'react';

interface RefetchProps {
  refetch: () => Promise<any> | void;
}

const Refetch: React.FC<RefetchProps> = ({ refetch }) => {
  return (
    <button
      onClick={refetch}
      aria-label="Refetch"
      title="Refetch"
      className="p-2 rounded-full hover:bg-main-background transition">
      <RotateCcw size={18} />
    </button>
  );
};

export default Refetch;

