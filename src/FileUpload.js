import React, { useMemo, useRef } from 'react';

export const FileUpload = ({ className, setContent }) => { 
  const ref = useRef();
  const reader = useMemo(() => {
    const fr = new FileReader();
    fr.onload = e => {
      setContent(JSON.parse(fr.result));
    };
    return fr;
  }, [ setContent ]);
  return (
    <div className={className}>
      <input
        ref={ref}
        type='file'
        style={{display: 'none'}}
        accept='.json'
        onChange={e => {
          reader.readAsText(e.target.files[0]);
        }}
      />
      <button
        className='btn btn-outline-secondary btn-sm'
        onClick={() => ref.current.click()}
      >
        Upload File
      </button>
    </div>
  );
 };
