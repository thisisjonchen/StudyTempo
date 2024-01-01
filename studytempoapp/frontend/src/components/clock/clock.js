import {useEffect, useState} from 'react';
import "./time.css";

function Clock() {
  const [hour, setHour] = useState()
  const [minute, setMinute] = useState()
  //const [second, setSecond] = useState()

  useEffect(() => {

    setInterval(() => {

      const dateObject = new Date()

      const hour = (""+(dateObject.getHours() % 12  || 12)).slice(-2);
      const minute = ("0"+(dateObject.getMinutes())).slice(-2);

      const currentHour = hour
      const currentMinute = minute

      setHour(currentHour)
      setMinute(currentMinute)
    }, 1000)

  }, [])

  return (
        <h2 style={{margin:0}}><span>{hour}</span>:<span>{minute}</span></h2>
  );
}
export {Clock};
