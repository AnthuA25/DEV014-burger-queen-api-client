import { useState, useEffect } from "react";

export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(timerId);
  }, []);

  const formattedTime = time.toLocaleTimeString(); // Formato de la hora

  return (
    <div className="clock">
      <h1>{formattedTime}</h1>
    </div>
  );
};
