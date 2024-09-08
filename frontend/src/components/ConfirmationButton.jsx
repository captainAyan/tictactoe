import { useState } from "react";

export default function ConfirmationButton({
  confirmationHandler,
  normalLabel,
  confirmationLabel,
  waitTime, // in seconds
  ...attrs
}) {
  const State = { NORMAL: "n", WAIT: "w", CONFIRMATION: "c" };
  const [currentState, setCurrentState] = useState(State.NORMAL);

  const [waitingLabel, setWaitingLabel] = useState(normalLabel);

  const startWaitTimer = () => {
    let timerCount = waitTime;
    setWaitingLabel(`Wait (${timerCount} Sec)`);
    let interval = setInterval(() => {
      if (timerCount > 0) {
        timerCount -= 1;
        setWaitingLabel(`Wait (${timerCount} Sec)`);
      } else {
        clearInterval(interval);
        setCurrentState(State.CONFIRMATION);
      }
    }, 1000);
  };

  const clickHandler = () => {
    if (currentState === State.NORMAL) {
      setCurrentState(State.WAIT);
      startWaitTimer();
    } else if (currentState === State.CONFIRMATION) confirmationHandler();
  };

  return (
    <button
      {...attrs}
      onClick={clickHandler}
      disabled={currentState === State.WAIT}
    >
      {currentState === State.NORMAL && normalLabel}
      {currentState === State.CONFIRMATION && confirmationLabel}
      {currentState === State.WAIT && waitingLabel}
    </button>
  );
}
