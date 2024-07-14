window.onload = function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const colorInput = document.getElementById('color');
    const opacityInput = document.getElementById('opacity');
    const thicknessInput = document.getElementById('thickness');
    const penStyleSelect = document.getElementById('penStyle');
    const brushStyleSelect = document.getElementById('brushStyle');
    const clearButton = document.getElementById('clearButton');
    const eraserButton = document.getElementById('eraserButton');
    let painting = false;
    let erasing = false;
    let history = [];

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function endPosition() {
        painting = false;
        ctx.beginPath(); // Reset the current path so it doesn't connect lines
    }

    function draw(e) {
        if (!painting) return;

        ctx.lineWidth = thicknessInput.value; // Set the width of the brush
        ctx.lineCap = 'round'; // Set the end of the lines to be rounded
        ctx.strokeStyle = colorInput.value; // Set the brush color
        ctx.globalAlpha = opacityInput.value; // Set the opacity of the brush

        if (erasing) {
            ctx.globalCompositeOperation = 'destination-out'; // Eraser mode
            ctx.strokeStyle = 'rgba(255,255,255,1)'; // White color for eraser
        } else {
            ctx.globalCompositeOperation = 'source-over'; // Normal drawing mode
            ctx.strokeStyle = colorInput.value;
        }

        let pos = getMousePos(canvas, e);

        switch (brushStyleSelect.value) {
            case 'highlighter':
                ctx.globalAlpha = 0.5;
                ctx.strokeStyle = colorInput.value;
                break;
            case 'spray':
                sprayPaint(pos);
                break;
            case 'shiny':
                shinyBrush(pos);
                break;
            case 'pen':
            default:
                penBrush(pos);
                break;
        }

        function penBrush(pos) {
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }
    
        function sprayPaint(pos) {
            const density = 50;
            for (let i = 0; i < density; i++) {
                const offsetX = (Math.random() - 0.5) * thicknessInput.value * 2;
                const offsetY = (Math.random() - 0.5) * thicknessInput.value * 2;
                ctx.fillRect(pos.x + offsetX, pos.y + offsetY, 1, 1);
            }
        }
    
        function shinyBrush(pos) {
            const gradient = ctx.createRadialGradient(
                pos.x,
                pos.y,
                0,
                pos.x,
                pos.y,
                thicknessInput.value
            );
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(0.5, colorInput.value);
            gradient.addColorStop(1, 'black');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, thicknessInput.value / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        switch (penStyleSelect.value) {
            case 'dashed':
                ctx.setLineDash([10, 10]); // Dash length 10px, gap length 10px
                break;
            case 'dotted':
                ctx.setLineDash([2, 10]); // Dot length 2px, gap length 10px
                break;
            case 'solid':
            default:
                ctx.setLineDash([]); // Solid line
                break;
        }

        // Store the drawing action in history
        history.push({ type: 'draw', x: pos.x, y: pos.y });
    }

    function toggleEraser() {
        erasing = !erasing;
        eraserButton.textContent = erasing ? 'Drawing' : 'Eraser';
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        history = [];
    }

    // Event listeners for mouse actions
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    eraserButton.addEventListener('click', toggleEraser);
    clearButton.addEventListener('click', clearCanvas);

    // Function to redraw the canvas based on history
    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        for (let action of history) {
            if (action.type === 'draw') {
                ctx.lineTo(action.x, action.y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(action.x, action.y);
            }
        }
    }

    // Event listener for clear button
    clearButton.addEventListener('click', function() {
        // Clear the canvas and reset history
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        history = [];
    });
};
