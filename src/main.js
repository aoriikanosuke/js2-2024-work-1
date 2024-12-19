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

function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

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

    const { x, y } = getMousePosition(event);

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

    const { x, y } = getMousePosition(event);

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

function updateBrushSettings() {
    brushColor = colorPicker.value;
    brushSize = parseInt(brushSizeInput.value, 10);
}

function handleMouseMove(event) {
    if (currentTool === 'pen') {
        draw(event);
    } else if (currentTool === 'eraser') {
        erase(event);
    }
}

// Event listeners
canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseleave', stopPainting);

toolSelector.addEventListener('change', () => {
    currentTool = toolSelector.value;
});

colorPicker.addEventListener('input', updateBrushSettings);
brushSizeInput.addEventListener('input', updateBrushSettings);

clearButton.addEventListener('click', clearCanvas);
saveButton.addEventListener('click', saveCanvasImage);