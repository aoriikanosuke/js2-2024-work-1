const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const toolSelector = document.getElementById('tool');
const colorPicker = document.getElementById('color');
const brushSizeInput = document.getElementById('brushSize');
const clearButton = document.getElementById('clearCanvas');
const saveButton = document.getElementById('saveImage');

let painting = false;
let currentTool = 'pen';
let brushColor = colorPicker.value;
let brushSize = parseInt(brushSizeInput.value, 10);

function startPainting(event) {
    painting = true;
    if (currentTool === 'pen') {
        draw(event);
    } else if (currentTool === 'bucket') {
        fillCanvas();
    }
}

function stopPainting() {
    painting = false;
    ctx.beginPath(); // Reset the path to avoid connecting lines between strokes
}

function draw(event) {
    if (!painting || currentTool !== 'pen') return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function erase(event) {
    if (!painting || currentTool !== 'eraser') return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
}

function fillCanvas() {
    ctx.fillStyle = brushColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCanvasImage() {
    const link = document.createElement('a');
    link.download = 'painting.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Event listeners
canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mousemove', (event) => {
    if (currentTool === 'pen') {
        draw(event);
    } else if (currentTool === 'eraser') {
        erase(event);
    }
});
canvas.addEventListener('mouseleave', stopPainting);

toolSelector.addEventListener('change', () => {
    currentTool = toolSelector.value;
});

colorPicker.addEventListener('input', () => {
    brushColor = colorPicker.value;
});

brushSizeInput.addEventListener('input', () => {
    brushSize = parseInt(brushSizeInput.value, 10);
});

clearButton.addEventListener('click', clearCanvas);
saveButton.addEventListener('click', saveCanvasImage);
