import { useEffect } from 'react';

const useScript = (url, callback) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    script.onload = () => { 
        if (callback) callback();
    };

    return () => {
      document.body.removeChild(script);
    }
  }, [url, callback]);
};

export default useScript;