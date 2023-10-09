import { useState, useEffect } from 'react';
import "./Clock.css";

function Clock() {
  const [hour, setHour] = useState()
  const [minute, setMinute] = useState()
  const [second, setSecond] = useState()

  useEffect(() => {

    setInterval(() => {

      const dateObject = new Date()

      const hour = (""+(dateObject.getHours() % 12  || 12)).slice(-2);
      const minute = ("0"+(dateObject.getMinutes())).slice(-2);
      const second = ("0"+(dateObject.getSeconds())).slice(-2);

      const currentHour = hour
      const currentMinute = minute
      const currentSecond = second

      setHour(currentHour)
      setMinute(currentMinute)
      setSecond(currentSecond)
    }, 1000)

  }, [])

  return (
        <h2 className="center-clock"><span>{hour}</span>:<span>{minute}</span>:<span className="second">{second}</span></h2>
  );
}
export default Clock;
