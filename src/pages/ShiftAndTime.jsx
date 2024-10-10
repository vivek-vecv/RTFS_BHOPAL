import { useState, useEffect } from "react";

function ShiftAndTime() {
  const [shift, setShift] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("password", headers);
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? "PM" : "AM";
      const adjustedHours = hours % 12 || 12;
      const formattedTime = `${now.toLocaleDateString()} ${adjustedHours}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;
      const shift = hours < 12 ? "A" : hours < 18 ? "B" : "C";
      setCurrentTime(formattedTime);
      setShift(shift);
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once when the component mounts

  return { currentTime, shift }; // Return the values to be used elsewhere
}

export default ShiftAndTime;
