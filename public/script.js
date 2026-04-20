// Verbindung zum Server herstellen
const socket = io();

// Canvas holen
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Canvas Größe (ganzer Bildschirm)
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Zeichen-Einstellungen
ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.strokeStyle = "black";

let drawing = false;

// Zeichnen starten
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    draw(e);
});

// Zeichnen stoppen
canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});

// Zeichnen stoppen, wenn Maus rausgeht
canvas.addEventListener("mouseleave", () => {
    drawing = false;
    ctx.beginPath();
});

// Zeichnen bei Bewegung
canvas.addEventListener("mousemove", draw);

function draw(e) {
    if (!drawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    // lokal zeichnen
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // an Server senden
    socket.emit("draw", { x, y });
}

// Daten von anderen Nutzern empfangen
socket.on("draw", (data) => {
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
});

// Fenstergröße ändern → Canvas anpassen
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
