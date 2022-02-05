export interface Grid {
    rows: number[][];
}

// Wir wahrscheinlich soll es sein, dass ein Kästchen wieder geleert wird
export function generate(difficulty: number = 2) {
    let grid: Grid = {
        rows: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    };

    // Die erste Zeile ist Zufall, danach lassen wir unseren Solver auf das Grid los
    grid.rows[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => (Math.random() > .5) ? 1 : -1);
    solve(grid);

    // Jetzt müssen wir aus der fertig Lösung wieder ein paar Felder auf 0 setzen
    for (let y = 0; y < grid.rows.length; y++) {
        for (let x = 0; x < grid.rows[y].length; x++) {
            // Je höher die Schwierigkeit, umso wahrscheinlicher wird das Feld geleert
            // Zufallswerte 0 bis 4
            if (Math.floor(Math.random() * 7) < difficulty) {
                grid.rows[y][x] = 0;
            }
        }
    }

    return grid;
}

export function isPossible(grid: Grid, y: number, x: number, n: number) {
    // Haben wie die Zahl die wir eintragen wollen schon in der Reihe? -> Alle Felder in Reihe mit neuem Wert vergleichen
    for (let i = 0; i < 9; i++) {
        if (grid.rows[y][i] == n) {
            return false;
        }
    }
    // Haben wie die Zahl die wir eintragen wollen schon in der Spalte? -> Alle Felder in Spalte mit neuem Wert vergleichen
    for (let i = 0; i < 9; i++) {
        if (grid.rows[i][x] == n) {
            return false;
        }
    }
    // Juhu, nur noch im aktuellen Block (3x3) prüfen
    // Aber wo fängt der block an? -> Wir teilen durch drei und runden ab
    let startX = Math.floor(x / 3) * 3;
    let startY = Math.floor(y / 3) * 3;
    // Wir haben den Anfang, jetzt schauen wir uns alle 9 Kästchen an und hoffen, dass unsere Zahl noch nicht darin vorkommt
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid.rows[startY + i][startX + j] == n) {
                return false;
            }
        }
    }
    // Die Zahl passt
    return true;
}

export function solve(grid: Grid, solveOne = true) {
    // Wir schauen uns das komplette Sudoku an
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            // Ist das aktuelle Feld leer?
            if (grid.rows[y][x] == 0) {
                // -> Wir probiere ganz Stumpf jede Zahl von 1 bis 9 bis eine passt
                for (let n = 1; n < 10; n++) {
                    if (isPossible(grid, y, x, n)) {
                        // Passt
                        grid.rows[y][x] = n;
                        // Jetzt lassen wir sich die Funktion immer wieder selbst aufrufen, sie wird erst aufhören zu laufen, wenn es keine leeren Kästchen mehr gibt
                        // -> Kein leeres Kästchen -> Funktion kommt hier nicht an
                        if (solve(grid, solveOne) !== false && solveOne === true) {
                            return true;
                        }
                        // Falls wir mit der Nummer später nicht weiter machen können müssen wir aber nochmal einen Schritt zurück
                        // Weil sich die Funktion immer wieder selbst aufgerufen hat, kann das passieren bis wir wieder ganz am Anfang sind
                        grid.rows[y][x] = 0;
                    }
                }
                // Wir haben alle Zahlen probiert aber nichts hat geklappt? -> Wir müssen wieder zurück
                return false;
            }
        }
    }
    // Wenn wir hier ankommen ist das Sudoku gelöst :)
    return grid;
}

export function printGrid(grid: Grid) {
    console.log("|-----------------------------------|");
    grid.rows.forEach(row => {
        console.log(`| ${row.join(" | ")} |`);
        console.log("|-----------------------------------|");
    });
    console.log("\n");
}
