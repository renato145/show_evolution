import { useMemo } from 'react';

export const useEAData = url => ( 
  useMemo(() => {
      return {
        n: 40
      };
  }, [ url ])
);