import { useState, useEffect } from "react";

const useTimeRestriction = () => {
  const [isRestricted, setIsRestricted] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      setIsRestricted(hour >= 23 || hour < 8);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // cek tiap menit

    return () => clearInterval(interval);
  }, []);

  return isRestricted;
};

export default useTimeRestriction;