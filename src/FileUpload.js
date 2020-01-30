import React, { useMemo } from 'react';

export const FileUpload = ({ setContent }) => { 
  const reader = useMemo(() => {
    const fr = new FileReader();
    fr.onload = e => {
      setContent(JSON.parse(fr.result));
    };
    return fr;
  }, []);
  return (
    <input
      type='file'
      name='file'
      onChange={e => {
        reader.readAsText(e.target.files[0]);
      }}/>
  );
 };
