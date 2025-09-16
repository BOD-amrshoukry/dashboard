import type { ChildrenType } from '../types/general';
import Loading from './loading';
import Refetch from './refetch';

type IsLoadingType = boolean;
type ErrorType = string | null | undefined;

export interface DataDisplayInterface<T> {
  isLoading: IsLoadingType;
  error: ErrorType;
  data: T | null | undefined;
  children: ChildrenType;
  refetch?: () => void;
}

const DataDisplay = <T,>({
  isLoading,
  error,
  data,
  children,
  refetch,
}: DataDisplayInterface<T>) => {
  if (isLoading) {
    return <Loading />;
  }

  if (data) {
    return children;
  }

  if (error) {
    return (
      <div className="flex items-center gap-[16px]">
        <p>{error}</p>
        {refetch && <Refetch refetch={refetch} />}
      </div>
    );
  }

  return children;
};

export default DataDisplay;

