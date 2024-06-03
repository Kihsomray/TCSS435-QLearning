const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {

    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");

    gameEngine.init(ctx);

    let gridWorld = new GridWorld(5);
    let agent = new QLearningAgent(gridWorld);

    // Add to game engine
    const agentEntity = new QLearningAgentEntity(agent, gridWorld);
    gameEngine.addEntity(agentEntity);
    gameEngine.addEntity(new GridWorldEntity(gridWorld));

    gameEngine.start();

    // train the agent repeatedly
    async function trainAgent() {
        for (let episode = 0; episode < document.getElementById("episodeSlider").value; episode++) {

            let state = gridWorld.reset();

            while (!gridWorld.isTerminal(state)) {

                const action = agent.getAction(state);
                const nextState = gridWorld.nextState(action);

                agent.updateQValue(state, action, gridWorld.getReward(nextState), nextState);
                state = nextState;

                // Update the agent's position in the game engine
                agentEntity.updatePosition(state);
                gameEngine.loop()

                // Delay
                await new Promise(r => setTimeout(r, 100 - document.getElementById("speedSlider").value));
				
            }

        }

        // Log the optimal policy after training
        const optimalPolicy = agent.getOptimalPolicy();
        console.log("Optimal Policy:");
        optimalPolicy.forEach(p => {
            console.log(`State: (${p.state.x}, ${p.state.y}), Action: ${p.action}`);
        });
    }

    trainAgent();

	document.getElementById("resetButton").addEventListener("click", () => {

		// Reset everything the same way as above
		gridWorld = new GridWorld(5);
		agent = new QLearningAgent(gridWorld);
		agentEntity.agent = agent;
		agentEntity.gridWorld = gridWorld;

		agentEntity.updatePosition(gridWorld.getState());
		gameEngine.entities = [];
		gameEngine.addEntity(agentEntity);
		gameEngine.addEntity(new GridWorldEntity(gridWorld));

		// run it again
		trainAgent();
		
	});

});
