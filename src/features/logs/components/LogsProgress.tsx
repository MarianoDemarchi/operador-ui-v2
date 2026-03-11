import { Progress } from "antd";
import { useEffect, useRef, useState } from "react";

interface LogsProgressProps {
  isFetching: boolean;
  dataUpdatedAt: number;
  interval: number; // ms
}

export const LogsProgress: React.FC<LogsProgressProps> = ({
  isFetching,
  dataUpdatedAt,
  interval,
}) => {
  const [percent, setPercent] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // limpiar intervalo anterior
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }

    setPercent(0);
    const start = Date.now();

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const value = Math.min((elapsed / interval) * 100, 100);
      setPercent(value);
    }, 100);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [dataUpdatedAt, interval]);

  return (
    <Progress
      percent={Math.round(percent)}
      showInfo={false}
      size="small"
      status={isFetching ? "active" : "normal"}
    />
  );
};
