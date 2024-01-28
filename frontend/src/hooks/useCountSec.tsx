import { useCallback, useEffect, useState } from "react";

import { format } from "date-fns";

type UseCountSecProps = {
  targetSec: number;
  type: "mm:ss" | "ss";
};

const INITIAL_TIMER = 0;

const useCountSec = (props: UseCountSecProps) => {
  const { targetSec, type } = props;
  const [seconds, setSeconds] = useState(INITIAL_TIMER);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (seconds >= targetSec) {
      setIsActive(false);
    }

    if (isActive && seconds < targetSec) {
      interval = setInterval(() => {
        setSeconds((prevSec) => prevSec + 1);
      }, 1000);
    } else if (interval && (!isActive || seconds > targetSec)) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [targetSec, isActive, seconds]);

  function formatTime(sec: number) {
    switch (type) {
      case "mm:ss": {
        return format(sec * 1000, "mm:ss");
      }

      case "ss": {
        return format(sec * 1000, "ss");
      }
    }
  }

  const startTimer = useCallback(() => {
    setSeconds(INITIAL_TIMER);
    setIsActive(true);
  }, []);

  const toggleTimer = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const resetTimer = () => {
    setSeconds(INITIAL_TIMER);
    setIsActive(false);
  };

  return {
    time: formatTime(seconds),
    active: isActive,
    startTimer,
    toggleTimer,
    resetTimer,
  };
};

export default useCountSec;
