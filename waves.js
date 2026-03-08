class Waves {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.options = Object.assign({
            strokeColor: "#333333",
            backgroundColor: "#000000",
            pointerSize: 0.5
        }, options);

        this.mouse = {
            x: -10,
            y: 0,
            lx: 0,
            ly: 0,
            sx: 0,
            sy: 0,
            v: 0,
            vs: 0,
            a: 0,
            set: false,
        };

        this.lines = [];
        this.paths = [];
        this.noise = new SimplexNoise();
        this.raf = null;
        this.bounding = null;

        this.init();
    }

    init() {
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.classList.add('block', 'w-full', 'h-full');
        this.svg.style.display = 'block';
        this.svg.style.width = '100%';
        this.svg.style.height = '100%';
        this.container.appendChild(this.svg);

        this.setSize();
        this.setLines();

        this.onResize = this.onResize.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.tick = this.tick.bind(this);

        window.addEventListener('resize', this.onResize);
        window.addEventListener('mousemove', this.onMouseMove);
        this.container.addEventListener('touchmove', this.onTouchMove, { passive: false });
    }

    setSize() {
        this.bounding = this.container.getBoundingClientRect();
        const { width, height } = this.bounding;
        this.svg.setAttribute('width', width);
        this.svg.setAttribute('height', height);
    }

    setLines() {
        const { width, height } = this.bounding;
        this.lines = [];

        // Clear existing paths
        this.paths.forEach(path => path.remove());
        this.paths = [];

        const xGap = 8;
        const yGap = 8;

        const oWidth = width + 200;
        const oHeight = height + 30;

        const totalLines = Math.ceil(oWidth / xGap);
        const totalPoints = Math.ceil(oHeight / yGap);

        const xStart = (width - xGap * totalLines) / 2;
        const yStart = (height - yGap * totalPoints) / 2;

        for (let i = 0; i < totalLines; i++) {
            const points = [];
            for (let j = 0; j < totalPoints; j++) {
                points.push({
                    x: xStart + xGap * i,
                    y: yStart + yGap * j,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                });
            }

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', this.options.strokeColor);
            path.setAttribute('stroke-width', '1');

            this.svg.appendChild(path);
            this.paths.push(path);
            this.lines.push(points);
        }
    }

    onResize() {
        this.setSize();
        this.setLines();
    }

    onMouseMove(e) {
        this.updateMousePosition(e.pageX, e.pageY);
    }

    onTouchMove(e) {
        if (e.touches.length > 0) {
            this.updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
        }
    }

    updateMousePosition(x, y) {
        if (!this.bounding) return;

        this.mouse.x = x - this.bounding.left;
        this.mouse.y = y - this.bounding.top;

        if (!this.mouse.set) {
            this.mouse.sx = this.mouse.x;
            this.mouse.sy = this.mouse.y;
            this.mouse.lx = this.mouse.x;
            this.mouse.ly = this.mouse.y;
            this.mouse.set = true;
        }
    }

    movePoints(time) {
        const mouse = this.mouse;
        const noise = this.noise;

        this.lines.forEach((points) => {
            points.forEach((p) => {
                const move = noise.noise2D(
                    (p.x + time * 0.008) * 0.003,
                    (p.y + time * 0.003) * 0.002
                ) * 8;

                p.wave.x = Math.cos(move) * 12;
                p.wave.y = Math.sin(move) * 6;

                const dx = p.x - mouse.sx;
                const dy = p.y - mouse.sy;
                const d = Math.hypot(dx, dy);
                const l = Math.max(175, mouse.vs);

                if (d < l) {
                    const s = 1 - d / l;
                    const f = Math.cos(d * 0.001) * s;

                    p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00035;
                    p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00035;
                }

                p.cursor.vx += (0 - p.cursor.x) * 0.01;
                p.cursor.vy += (0 - p.cursor.y) * 0.01;

                p.cursor.vx *= 0.95;
                p.cursor.vy *= 0.95;

                p.cursor.x += p.cursor.vx;
                p.cursor.y += p.cursor.vy

                p.cursor.x = Math.min(50, Math.max(-50, p.cursor.x));
                p.cursor.y = Math.min(50, Math.max(-50, p.cursor.y));
            });
        });
    }

    moved(point, withCursorForce = true) {
        return {
            x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
            y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
        };
    }

    drawLines() {
        this.lines.forEach((points, lIndex) => {
            if (points.length < 2 || !this.paths[lIndex]) return;

            const firstPoint = this.moved(points[0], false);
            let d = `M ${firstPoint.x} ${firstPoint.y}`;

            for (let i = 1; i < points.length; i++) {
                const current = this.moved(points[i]);
                d += ` L ${current.x} ${current.y}`;
            }

            this.paths[lIndex].setAttribute('d', d);
        });
    }

    tick(time) {
        const mouse = this.mouse;

        mouse.sx += (mouse.x - mouse.sx) * 0.1;
        mouse.sy += (mouse.y - mouse.sy) * 0.1;

        const dx = mouse.x - mouse.lx;
        const dy = mouse.y - mouse.ly;
        const d = Math.hypot(dx, dy);

        mouse.v = d;
        mouse.vs += (d - mouse.vs) * 0.1;
        mouse.vs = Math.min(100, mouse.vs);

        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.a = Math.atan2(dy, dx);

        if (this.pointerDot) {
            this.pointerDot.style.transform = `translate3d(${mouse.sx}px, ${mouse.sy}px, 0) translate(-50%, -50%)`;
        }

        this.movePoints(time);
        this.drawLines();

        this.raf = requestAnimationFrame(this.tick);
    }

    start() {
        if (!this.raf) {
            this.raf = requestAnimationFrame(this.tick);
        }
    }

    stop() {
        if (this.raf) {
            cancelAnimationFrame(this.raf);
            this.raf = null;
        }
    }

    destroy() {
        this.stop();
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('mousemove', this.onMouseMove);
        this.container.removeEventListener('touchmove', this.onTouchMove);
        if (this.svg) this.svg.remove();
        if (this.pointerDot) this.pointerDot.remove();
    }
}
