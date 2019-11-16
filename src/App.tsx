import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

import "./App.css";

const NUM_ROWS = 35;
const NUM_COLUMS = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    rows.push(Array.from(Array(NUM_COLUMS), () => 0));
  }

  return rows;
};

const App: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(prevGrid => {
      return produce(prevGrid, newGrid => {
        for (let row = 0; row < NUM_ROWS; row++) {
          for (let column = 0; column < NUM_COLUMS; column++) {
            let neighbours = 0;
            operations.forEach(([x, y]) => {
              const newRow = row + x;
              const newColumn = column + y;

              if (
                newRow >= 0 &&
                newRow < NUM_ROWS &&
                newColumn >= 0 &&
                newColumn < NUM_COLUMS
              ) {
                neighbours += prevGrid[newRow][newColumn];
              }
            });

            if (neighbours < 2 || neighbours > 3) {
              newGrid[row][column] = 0;
            } else if (prevGrid[row][column] === 0 && neighbours === 3) {
              newGrid[row][column] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 1000);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <button
          onClick={() => {
            setRunning(prevState => !prevState);

            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button onClick={() => setGrid(generateEmptyGrid())}>Clear</button>

        <button
          onClick={() => {
            const rows = [];

            for (let i = 0; i < NUM_ROWS; i++) {
              rows.push(
                Array.from(Array(NUM_COLUMS), () =>
                  Math.random() > 0.5 ? 1 : 0
                )
              );
            }
            setGrid(rows);
          }}
        >
          Random
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${NUM_COLUMS}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((_column, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                });

                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "crimson" : undefined,
                border: "solid 1px black"
              }}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
