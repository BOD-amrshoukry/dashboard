import type { ChildrenType } from '../types/general';
import Loading from './loading';

type IsLoadingType = boolean;
type ErrorType = string | null | undefined;

export interface DataDisplayInterface<T> {
  isLoading: IsLoadingType;
  error: ErrorType;
  children: ChildrenType;
  data: T;
}

const DataDisplay = <T,>({
  isLoading,
  error,
  data,
  children,
}: DataDisplayInterface<T>) => {
  if (isLoading) {
    return <Loading />;
  }

  if (data) {
    return children;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return children;
};

export default DataDisplay;

