import { useEffect, useState } from "react";
import PuzzleGrid from "./components/PuzzleGrid";
import Select from "./components/Select";
import { useInterval } from "./helpers/useInterval";

export type IStats = {
  active: boolean;
  moveCount: number;
  startTime: number;
};

export default function App() {
  const [difficulty, setDifficulty] = useState(4);
  const [seconds, setSeconds] = useState(0);
  const [stats, setStats] = useState<IStats>({
    active: false,
    moveCount: 0,
    startTime: -1,
  });

  useEffect(() => {
    // Reset display and stats on difficulty change
    setSeconds(0);

    setStats({
      active: false,
      moveCount: 0,
      startTime: -1,
    });
  }, [difficulty]);

  useInterval(() => {
    // Update seconds display every.. second?
    if (!stats.active) return;
    setSeconds(Math.floor(Date.now() / 1000 - stats.startTime / 1000));
  }, 1e3);

  return (
    <>
      <Select
        options={[
          { id: "3", text: "Easy (3x3)" },
          { default: true, id: "4", text: "Normal (4x4)" },
          { id: "5", text: "Hard (5x5)" },
        ]}
        onChange={(event) => setDifficulty(Number(event.target.value))}
      />
      <PuzzleGrid difficulty={difficulty} statState={[stats, setStats]} />
      <p>
        {stats.moveCount} moves &ndash; {seconds} second
        {seconds == 1 ? "" : "s"}
      </p>
    </>
  );
}
