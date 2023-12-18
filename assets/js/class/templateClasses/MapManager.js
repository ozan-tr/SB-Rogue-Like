class MapManager {
    constructor() {

        this.dimensions = { width: 1400, height: 1000 };
        this.mapPositions = [];
        this.indices = { x: 213123, y: 12412 };
        this.viewPortOffset = {
            x: (this.dimensions.width - c.width) / 2,
            y: (this.dimensions.height - c.height) / 2,
        };
        this.drawOffset = 1;
        this.drawTiles = [];
        this.drawObstacles = [];
    }

    drawMap(ctx) {
        this.calculateIndices();

        this.drawTiles.forEach((mapPos) => {
            ctx.drawImage(this.background, mapPos.x, mapPos.y);
        });
    }

    updateSections() {
        this.drawTiles = [];
        this.indicesToDrawOn.forEach((index) => {
            this.drawTiles.push({
                x: index.x * this.dimensions.width - this.viewPortOffset.x,
                y: index.y * this.dimensions.height - this.viewPortOffset.y,
            });
        });
    }

    updateObstacles() {
        this.drawObstacles = [];
        this.obstacles.forEach((obstacle) => {
            this.indicesToDrawOn.forEach((index) => {
                const obstacleX =
                    index.x * this.dimensions.width - this.viewPortOffset.x + obstacle.x;
                const obstacleY =
                    index.y * this.dimensions.height - this.viewPortOffset.y + obstacle.y;
                this.drawObstacles.push({
                    x: obstacleX,
                    y: obstacleY,
                    w: obstacle.w,
                    h: obstacle.h,
                });
            });
        });
    }

    calculateIndices() {
        const playerOffset = player.getCenterPos();
        const playerPos = player.pos;

        const xIndex = -Math.floor((playerPos.x + playerOffset.x) / this.dimensions.width);
        const yIndex = -Math.floor((playerPos.y + playerOffset.y) / this.dimensions.height);

        if (xIndex !== this.indices.x || yIndex !== this.indices.y) {
            this.indicesToDrawOn = [];
            for (let x = xIndex - this.drawOffset; x <= xIndex + this.drawOffset; x++) {
                for (let y = yIndex - this.drawOffset; y <= yIndex + this.drawOffset; y++) {
                    this.indicesToDrawOn.push({ x, y });
                }
            }
            this.indices = { x: xIndex, y: yIndex };
            this.updateObstacles();
            this.updateSections();
        }
    }
}
