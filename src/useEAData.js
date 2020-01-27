import { useMemo } from 'react';

export const useEAData = url => ( 
  useMemo(() => {
      return {
        n: 10
      };
  }, [ url ])
);