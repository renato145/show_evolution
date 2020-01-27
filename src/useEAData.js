import { useMemo } from 'react';

export const useEAData = url => ( 
  useMemo(() => {
      return url;
  }, [ url ])
);