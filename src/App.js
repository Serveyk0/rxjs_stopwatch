import { useEffect, useMemo, useState } from "react";
import { timer, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export const App = () => {
  const [resetStart, setResetStart] = useState(true);
  const [isStart, setIsStart] = useState(false);
  const [time, setTime] = useState(0);
  const [s, setS] = useState(0);

  const down_s = useMemo(() => new Subject(), [])
  const reset$ = useMemo(() => new Subject(), [])
  
  let clickCount = 0;

  const startClick$ = () => {
    timer(0, 1000)
      .pipe(
        takeUntil(down_s),
        takeUntil(reset$)
      )
      .subscribe(num => {
        setTime(s + num)
      })
  };
  useEffect(() => {
    startClick$();
  }, [resetStart])

  const stopTimer = () => {
    setTime(0);
    setS(0);
    down_s.next();
  }

  const resetTimer = async () => {
    down_s.next();
    setResetStart(!resetStart);
  }

  const wait = () => {
    setIsStart(true);
    down_s.next();
    setS(time);
  }

  const doubleClick = () => {
    clickCount++;
    setTimeout(() => {
      if (clickCount === 2) {
        wait()
      }
      clickCount = 0;
    }, 299)
  }

  return (
    <div className="App">
      <div className="btn-container">
        <div>
          {
            Math.floor(time / 3600) + " : " +
            Math.floor((time / 60) % 60) + " : " +
            (time % 60)
          }
        </div>
        <button id="start" onClick={() => {
          isStart ? startClick$() : stopTimer();
          setIsStart(!isStart)
        }}>{isStart ? 'START' : 'STOP'}</button>
        <button onClick={() => {
          setS(0); resetTimer()
        }} disabled={isStart}>RESET</button>
        <button onClick={() => {
          doubleClick()
        }}>W8</button>
      </div>
    </div>
  );
}