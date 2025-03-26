"use dom";

import { SetStateAction, useEffect, useRef } from "react";
import styled from "styled-components";
import { shuffleArray } from "../helpers/shuffle";
import "../moving.css";
import { IStats } from "../App";

type IPuzzleGrid = {
  difficulty: number;
  statState: [IStats, React.Dispatch<SetStateAction<IStats>>];
};

const Grid = styled.div<{ $difficulty: number }>`
  border: solid 1px black;
  display: grid;
  grid-template-columns: repeat(${(props) => props.$difficulty}, 64px);
  grid-template-rows: repeat(${(props) => props.$difficulty}, 64px);
  width: fit-content;
`;

const Tile = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  font-family: sans-serif;
  font-size: 24px;
  justify-content: center;
  user-select: none;

  &:hover {
    border: solid 2px #00aaaa;
  }

  &:hover:active {
    background-color: #00aaaa;
    color: white;
  }
`;

export default function PuzzleGrid({ difficulty, statState }: IPuzzleGrid) {
  const [stats, setStats] = statState;
  const gridRef: React.RefObject<HTMLDivElement | null> = useRef(null);

  async function moveTile(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const children = Array.from(gridRef.current!.children);
    const tileIndex = children.indexOf(event.target as Element);

    // All the possible places for a tile to move to
    const allIndexes = [
      tileIndex - difficulty,
      tileIndex - 1,
      tileIndex + difficulty,
      tileIndex + 1,
    ];

    allIndexes.forEach(async (index) => {
      if (children[index] && children[index].nodeName == "SPAN") {
        // Condition required to prevent the player from moving tiles from the
        // start/end of one row to the end/start of the row above or below it.
        if (
          (allIndexes.indexOf(index) == 1 || allIndexes.indexOf(index) == 3) &&
          Math.floor(tileIndex / difficulty) !== Math.floor(index / difficulty)
        )
          return;

        // Activate game timer and increment move count
        if (!stats.active) {
          setStats({
            ...stats,
            active: true,
            moveCount: stats.moveCount + 1,
            startTime: Date.now(),
          });
        } else {
          setStats({
            ...stats,
            moveCount: stats.moveCount + 1,
          });
        }

        // Add transition class to the tile that needs moving
        const transitionClass = `move-${allIndexes.indexOf(index)}`;
        (event.target as Element).classList.add(transitionClass);

        [children[index], children[tileIndex]] = [
          children[tileIndex],
          children[index],
        ];

        await new Promise((resolve) => setTimeout(resolve, 2e2));
        (event.target as Element).classList.remove(transitionClass);
        gridRef.current!.replaceChildren(...children);

        // Check if all the tiles are in the right order
        const passes: boolean[] = [];

        for (let i = 0; i < children.length; i++) {
          if (children[i].nodeName == "DIV") {
            const child = children[i] as HTMLDivElement;
            passes.push(Number(child.innerText) == i + 1);
          }
        }

        if (passes.filter((pass) => !pass).length < 1) {
          alert("win");

          // Stop the game from ticking
          setStats({
            ...stats,
            active: false,
          });
        }
      }
    });
  }

  useEffect(() => {
    // Shuffle tiles when difficulty changes
    const children = Array.from(gridRef.current!.children);
    shuffleArray(children);
    gridRef.current!.replaceChildren(...children);
  }, [difficulty]);

  const tiles: React.ReactElement[] = [];
  for (let i = 0; i < difficulty * difficulty - 1; i++)
    tiles.push(<>{i + 1}</>);

  return (
    <Grid $difficulty={difficulty} ref={gridRef}>
      {tiles.map((value, index) => (
        <Tile key={index} onClick={moveTile} tabIndex={0}>
          {value}
        </Tile>
      ))}

      {/* An empty tile used for logic */}
      <span></span>
    </Grid>
  );
}
