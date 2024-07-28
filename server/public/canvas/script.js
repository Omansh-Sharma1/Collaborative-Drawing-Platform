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
    let currentPath = [];
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const socket = io();

    socket.on('connect', () => {
        console.log('Connected to server socket');

        if (roomId) {
            socket.emit('joinRoom', { roomId });
            console.log(`Joined room: ${roomId}`);
        }

        socket.on('roomNotFound', (roomId) => {
            alert(`Room with ID: ${roomId} not found`);
            window.location.href = '/';
        });

        socket.on('drawing', (data) => {
            ctx.lineWidth = data.lineWidth;
            ctx.strokeStyle = data.strokeStyle;
            ctx.globalAlpha = data.globalAlpha;
            ctx.globalCompositeOperation = data.globalCompositeOperation;
            const brushStyle = data.brushStyle;

            if (brushStyle === 'pen') {
                drawPen(data.path);
            } else if (brushStyle === 'highlighter') {
                drawHighlighter(data.path);
            } else if (brushStyle === 'spray') {
                drawSpray(data.path, data.lineWidth);
            } else if (brushStyle === 'shiny') {
                drawShiny(data.path, data.lineWidth, data.strokeStyle);
            }
        });

        socket.on('clearCanvas', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            history = [];
        });

        socket.on('toggleEraser', (erasingState) => {
            erasing = erasingState;
            eraserButton.textContent = erasing ? 'Drawing' : 'Eraser';
        });

        socket.on('updateBrushSettings', (settings) => {
            colorInput.value = settings.color;
            opacityInput.value = settings.opacity;
            thicknessInput.value = settings.thickness;
            penStyleSelect.value = settings.penStyle;
            brushStyleSelect.value = settings.brushStyle;
        });
    });

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function startPosition(e) {
        painting = true;
        currentPath = [];
        draw(e);
    }

    function endPosition() {
        painting = false;
        ctx.beginPath();
        if (currentPath.length > 0) {
            socket.emit('drawing', {
                lineWidth: thicknessInput.value,
                strokeStyle: colorInput.value,
                globalAlpha: opacityInput.value,
                globalCompositeOperation: ctx.globalCompositeOperation,
                brushStyle: brushStyleSelect.value,
                path: currentPath,
                roomId: roomId
            });
        }
    }

    function draw(e) {
        if (!painting) return;

        ctx.lineWidth = thicknessInput.value;
        ctx.lineCap = 'round';
        ctx.strokeStyle = colorInput.value;
        ctx.globalAlpha = opacityInput.value;

        if (erasing) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = thicknessInput.value * 2;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = colorInput.value;
        }

        let pos = getMousePos(canvas, e);
        currentPath.push(pos);

        switch (brushStyleSelect.value) {
            case 'highlighter':
                ctx.globalAlpha = 0.5;
                highlighterBrush(pos);
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

        function highlighterBrush(pos) {
            ctx.lineWidth = thicknessInput.value * 5;
            ctx.strokeStyle = colorInput.value;
            ctx.globalAlpha = 0.2; 
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }

        function sprayPaint(pos) {
            const density = 50;
            ctx.fillStyle = colorInput.value;
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
                ctx.setLineDash([10, 10]);
                break;
            case 'dotted':
                ctx.setLineDash([2, 10]);
                break;
            case 'solid':
            default:
                ctx.setLineDash([]);
                break;
        }

        history.push({ type: 'draw', x: pos.x, y: pos.y });
    }

    function toggleEraser() {
        erasing = !erasing;
        eraserButton.textContent = erasing ? 'Drawing' : 'Eraser';
        socket.emit('toggleEraser', { roomId: roomId, erasing });
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        history = [];
        socket.emit('clearCanvas', roomId);
    }

    function updateBrushSettings() {
        const settings = {
            color: colorInput.value,
            opacity: opacityInput.value,
            thickness: thicknessInput.value,
            penStyle: penStyleSelect.value,
            brushStyle: brushStyleSelect.value
        };
        socket.emit('updateBrushSettings', { roomId, settings });
    }

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    eraserButton.addEventListener('click', toggleEraser);
    clearButton.addEventListener('click', clearCanvas);

    colorInput.addEventListener('change', updateBrushSettings);
    opacityInput.addEventListener('change', updateBrushSettings);
    thicknessInput.addEventListener('change', updateBrushSettings);
    penStyleSelect.addEventListener('change', updateBrushSettings);
    brushStyleSelect.addEventListener('change', updateBrushSettings);

    clearButton.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        history = [];
        socket.emit('clearCanvas', roomId);
    });

    function drawPen(path) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
        ctx.beginPath();
    }

    function drawHighlighter(path) {
        ctx.lineWidth = thicknessInput.value * 5; // Match the highlighter effect
        ctx.globalAlpha = 0.2; // Match the highlighter opacity
        ctx.strokeStyle = colorInput.value;
    
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
        ctx.beginPath();
    }

    function drawSpray(path, lineWidth) {
        ctx.fillStyle = ctx.strokeStyle;
        const density = 50;
        for (let i = 0; i < path.length; i++) {
            const pos = path[i];
            for (let j = 0; j < density; j++) {
                const offsetX = (Math.random() - 0.5) * lineWidth * 2;
                const offsetY = (Math.random() - 0.5) * lineWidth * 2;
                ctx.fillRect(pos.x + offsetX, pos.y + offsetY, 1, 1);
            }
        }
    }

    function drawShiny(path, lineWidth, strokeStyle) {
        for (let i = 0; i < path.length; i++) {
            const pos = path[i];
            const gradient = ctx.createRadialGradient(
                pos.x,
                pos.y,
                0,
                pos.x,
                pos.y,
                lineWidth
            );
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(0.5, strokeStyle);
            gradient.addColorStop(1, 'black');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, lineWidth / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};
