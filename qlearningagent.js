// i used gpt to help me out with this
// so i can understand it better
//
// Using the Bellman update with a learning rate and discount rate
class QLearningAgent {

    env;
    alpha;
    gamma;
    epsilon;
    qTable;


    constructor(env) {

        this.env = env;

        // initial values
        this.alpha = 0.1;
        this.gamma = 0.9;
        this.epsilon = 0.1;

        this.qTable = {};

        for (let x = 0; x < env.size; x++) {
            for (let y = 0; y < env.size; y++) {

                // Initialize q values to 0
                this.qTable[`${x},${y}`] = {
                    'up': 0,
                    'down': 0,
                    'left': 0,
                    'right': 0
                };

            }
        }

    }

    getAction(state) {

        if (Math.random() < this.epsilon) {

            // Explore
            const actions = this.env.getActions();
            return actions[Math.floor(Math.random() * actions.length)];

        } else {

            // Exploit
            const qValues = this.qTable[`${state.x},${state.y}`];
            return Object.keys(qValues)
                .reduce((a, b) => qValues[a] > qValues[b] ? a : b);

        }
    }

    updateQValue(state, action, reward, nextState) {

        const qValue = this.qTable[`${state.x},${state.y}`][action];

        // This is being stupid
        console.log(qValue, this.alpha, reward);

        // next state
        const nextQValues = this.qTable[`${nextState.x},${nextState.y}`];

        // find max
        let maxNextQValue = -Infinity;
        for (let value of Object.values(nextQValues)) {

            if (value > maxNextQValue) {

                maxNextQValue = value;
            }
        }

        this.qTable[`${state.x},${state.y}`][action] = qValue + this.alpha * (reward + this.gamma * maxNextQValue - qValue);

    }

    // Get the optimal policy
    getOptimalPolicy() {
        let policy = [];

        for (let x = 0; x < this.env.size; x++) {

            for (let y = 0; y < this.env.size; y++) {

                const qValues = this.qTable[`${x},${y}`];

                // find highest val
                let bestAction = null;
                let maxQValue = -Infinity;
                for (let action in qValues) {

                    if (qValues[action] > maxQValue) {
                        bestAction = action;
                        maxQValue = qValues[action]
                    }

                }

                // add it
                policy.push({ state: { x, y }, action: bestAction });

            }
        }
        return policy;

    }
}

class QLearningAgentEntity {

    agent;
    gridWorld;
    size;
    position;


    constructor(agent, gridWorld) {

        this.agent = agent
        this.gridWorld = gridWorld;

        console.log(this.gridWorld)

        this.position = this.gridWorld.getState();

    }

    updatePosition(state) {

        this.position = state;
    }

    update() {
        // nothing
    }

    draw(ctx) {
        const { x, y } = this.position;
        ctx.fillStyle = "blue";
        ctx.fillRect(x * 50, y * 50, 50, 50)

    }

}

