import {useEffect, useState} from 'react';

const Clock = ({militaryTime}) => {
  const [hour, setHour] = useState()
  const [minute, setMinute] = useState()
  //const [second, setSecond] = useState()

  useEffect(() => {
    setInterval(() => {

      const dateObject = new Date()

      let hour;

      if (militaryTime === "false") {
        hour = (""+(dateObject.getHours() % 12 || 12)).slice(-2);
      }
      else {
        hour = ("0"+dateObject.getHours()).slice(-2);
      }

      const minute = ("0"+(dateObject.getMinutes())).slice(-2);

      const currentHour = hour
      const currentMinute = minute

      setHour(currentHour)
      setMinute(currentMinute)
    }, 1000)
  }, [])

  return (
        <h2 style={{margin:0}} className="text-[9rem] leading-none font-bold">
          <span>{hour}</span>:<span>{minute}</span>
        </h2>
  );
}

export default Clock;
