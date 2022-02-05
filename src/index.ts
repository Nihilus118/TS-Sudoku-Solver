import { Grid, isPossible, generate, solve } from "./sudoku";

// Am Anfang erstellen wir einfach ein Feld und zeigen es an
let grid = generate(2);
renderGrid(grid);

// Funktion zum erstellen des HTML
function renderGrid(grid: Grid) {
    const gridTable = document.getElementById("grid")!;
    gridTable.innerHTML = "";
    for (let y = 0; y < grid.rows.length; y++) {
        const row = grid.rows[y];
        let tableRow = document.createElement("tr");
        for (let x = 0; x < row.length; x++) {
            const value = row[x];
            const field = document.createElement("td");
            field.innerHTML = value.toString();
            field.classList.add("value");
            // Soll man das Feld bearbeiten dürfen?
            if (value == 0) {
                field.classList.add("editable");
                field.setAttribute("x", x.toString());
                field.setAttribute("y", y.toString());
                // Feld muss auswählbar sein
                field.addEventListener("click", () => {
                    let values = document.getElementsByClassName("value")!;
                    for (let i = 0; i < values.length; i++) {
                        values[i].id = "";
                    }
                    field.id = "active";
                });
            }
            tableRow.appendChild(field);
        };
        gridTable.appendChild(tableRow);
    };
}

// Button um ein neues Sudoku zu erstellen
const generateButton = document.getElementById("generate")!;
generateButton.addEventListener("click", () => {
    // Wir lesen die ausgewählte Schwierigkeit aus
    let select = (document.getElementById("difficulty")) as HTMLSelectElement;
    grid = generate(+select.value);
    renderGrid(grid);
});

// Button zum Lösen
const solveButton = document.getElementById("solve")!;
solveButton.addEventListener("click", () => {
    // Erstmal wieder alle Felder leeren damit der Spieler der Automatik keine Sackgasse bauen kann
    const editable = document.querySelectorAll(".editable");
    for (let i = 0; i < editable.length; i++) {
        let x = +editable[i].getAttribute("x")!;
        let y = +editable[i].getAttribute("y")!;
        grid.rows[y][x] = 0;
    }
    solve(grid);
    renderGrid(grid);
});

// Wert in aktiven Feld verändern
document.addEventListener("keypress", (e) => {
    let num = +e.key;
    // Es muss eine Ziffer eingegeben werden
    if (!isNaN(num)) {
        const active = document.getElementById("active")!;
        let x = +active.getAttribute("x")!;
        let y = +active.getAttribute("y")!;
        // Außerdem muss die Ziffer auch passen, aber auf 0 zurücksetzen darf man immer
        if (isPossible(grid, y, x, num) || num == 0) {
            grid.rows[y][x] = num;
            active.innerHTML = num.toString();
            // Wir merken uns was gelöst ist
            num == 0 ? active.classList.remove("solved") : active.classList.add("solved");
            // Wir prüfen wie viel noch zu lösen ist, wenn nichts mehr da ist hat der Spieler gewonnen
            const remaining = document.querySelectorAll(".editable:not(.solved)").length;
            if (remaining == 0) {
                if (confirm("Gewonnen! Nochmal?")) {
                    let select = (document.getElementById("difficulty")) as HTMLSelectElement;
                    grid = generate(+select.value);
                    renderGrid(grid);
                } else {
                    alert("Vielen Dank fürs Spielen :)");
                }
            }
        }
        else {
            alert("Nicht möglich.");
        }
    } else {
        alert("Bitte eine Zahl eingeben.");
    }
});
