class GridWorld {

    size;
    state;

    constructor(size) {

        this.size = size;
        this.state = { x: 0, y: 0 };
        this.actions = ['up', 'down', 'left', 'right'];
    }

    reset() {
        this.state = { x: 0, y: 0 };
        return this.state;
    }


    getState() {
        
        return this.state;
    }


    nextState(action) {

        let { x, y } = this.state;

        // action calulcation
        if (action === 'up' && y > 0) y--;
        if (action === 'down' && y < this.size - 1) y++;
        if (action === 'left' && x > 0) x--;
        if (action === 'right' && x < this.size - 1) x++;

        this.state = { x, y }; // update 
        return this.state;
    }

    getReward(state) {

        if (this.isTerminal(state)) return 100;
        return -1;

    }

    isTerminal(state) {
        return state.x === this.size - 1
            && state.y === this.size - 1;
    }

    getActions() {
        return this.actions;
    }

}

class GridWorldEntity {

    gridWorld;

    constructor(gridWorld) {

        this.gridWorld = gridWorld;
    }

    update() {

        // nothing` to update
    }

    draw(ctx) {

        const gridSize = this.gridWorld.size;

        // Draw the grid
        ctx.strokeStyle = "black";
        for (let x = 0; x < gridSize; x++) {

            for (let y = 0; y < gridSize; y++) {

                ctx.strokeRect(x * 50, y * 50, 50, 50);
            }
        }

        ctx.fillStyle = "green";
        ctx.fillRect((gridSize - 1) * 50, (gridSize - 1) * 50, 50, 50);

    }
}
