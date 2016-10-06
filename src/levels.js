const levels = [ {	laserCooldown: 5, dragonballLaunchWait: 10, maxSpitballs: 2, maxDragonballs: 2, dragonflyNoShootRadius: 80, dragonflyFlightPath: 'vertical-ellipse', weevilMargin: 10},
	{	laserCooldown: 5, dragonballLaunchWait: 15, maxSpitballs: 3, maxDragonballs: 3, dragonflyNoShootRadius: 80, dragonflyFlightPath: '3-leaf', },
	{	laserCooldown: 5, dragonballLaunchWait: 5, maxSpitballs: 3, maxDragonballs: 3, dragonflyNoShootRadius: 80, dragonflyFlightPath: 'flowery', },
	{	laserCooldown: 5, dragonballLaunchWait: 15, maxSpitballs: 4, maxDragonballs: 4, dragonflyNoShootRadius: 60, dragonflyFlightPath: 'guitar-pick', },
	{	laserCooldown: 5, dragonballLaunchWait: 5, maxSpitballs: 5, maxDragonballs: 5, dragonflyNoShootRadius: 60, dragonflyFlightPath: 'bacon-beast', },
	{	laserCooldown: 5, dragonballLaunchWait: 5, maxSpitballs: 6, maxDragonballs: 6, dragonflyNoShootRadius: 60, dragonflyFlightPath: 'star-8', },
	{	laserCooldown: 5, dragonballLaunchWait: 5, maxSpitballs: 7, maxDragonballs: 7, dragonflyNoShootRadius: 60, dragonflyFlightPath: 'pentagon', },
	{	laserCooldown: 5, dragonballLaunchWait: 10, maxSpitballs: 8, maxDragonballs: 8, dragonflyNoShootRadius: 90, dragonflyFlightPath: 'trillium-swoop', },
	{	laserCooldown: 5, dragonballLaunchWait: 5, maxSpitballs: 8, maxDragonballs: 4, dragonflyNoShootRadius: 60, dragonflyFlightPath: 'box', },
	{	laserCooldown: 5, dragonballLaunchWait: 0, maxSpitballs: 8, maxDragonballs: 24, dragonflyNoShootRadius: 60, dragonflyFlightPath: 'flyby-orbit', },
	{	laserCooldown: 5, dragonballLaunchWait: 2, maxSpitballs: 8, maxDragonballs: 36, dragonflyNoShootRadius: 80, dragonflyFlightPath: 'vertical-ellipse', },
	{	laserCooldown: 5, dragonballLaunchWait: 2, maxSpitballs: 8, maxDragonballs: 36, dragonflyNoShootRadius: 80, dragonflyFlightPath: 'fast-swoop', },
	{	laserCooldown: 5, dragonballLaunchWait: 15, maxSpitballs: 8, maxDragonballs: 12, dragonflyNoShootRadius: 80, dragonflyFlightPath: 'ninja', },
	{	laserCooldown: 4, dragonballLaunchWait: 0, maxSpitballs: 8, maxDragonballs: 128, dragonflyNoShootRadius: 80, dragonflyFlightPath: '3-leaf', },
	{	laserCooldown: 4, dragonballLaunchWait: 2, maxSpitballs: 8, maxDragonballs: 64, dragonflyNoShootRadius: 75, dragonflyFlightPath: 'hex-attack', },
	{	laserCooldown: 4, dragonballLaunchWait: 2, maxSpitballs: 8, maxDragonballs: 64, dragonflyNoShootRadius: 80, dragonflyFlightPath: 'spray-tan', },
	{	laserCooldown: 5, dragonballLaunchWait: 5, maxSpitballs: 12, maxDragonballs: 3, dragonflyNoShootRadius: 80, dragonflyFlightPath: 'flowery', weevilMargin: 30},
	{	laserCooldown: 5, dragonballLaunchWait: 5, maxSpitballs: 6, maxDragonballs: 3, dragonflyNoShootRadius: 80, dragonflyFlightPath: 'trillium-swoop', weevilMargin: 60},
	{	laserCooldown: 5, dragonballLaunchWait: 4, maxSpitballs: 4, maxDragonballs: 24, dragonflyNoShootRadius: 80, dragonflyFlightPath: 'vertical-ellipse', weevilMargin: 60},
	{	laserCooldown: 5, dragonballLaunchWait: 15, maxSpitballs: 8, maxDragonballs: 12, dragonflyNoShootRadius: 50, dragonflyFlightPath: 'ninja', weevilMargin: 30},






]

export { levels };


/*

{M: 120, N: 60, penRadius: -0.2, drawingRadius: 320, tilt: 0, name: 'vertical-ellipse', difficulty: 1},
	{M: 120, N: 80, penRadius: -0.2, drawingRadius: 600, tilt: 0, name: '3-leaf', difficulty: 3},	// pretty !
	{M: 96, N: 15, penRadius: 2, drawingRadius: 300, tilt: 0, name: 'flowery', difficulty: 1},
	{M: 96, N: 32, penRadius: 0.3, drawingRadius: 400, tilt: 0, name: 'guitar-pick', difficulty: 3},
	{M: 11, N: 44, penRadius: 2, drawingRadius: 30, tilt: 0, name: 'bacon-beast', difficulty: 3},
	{M: 96, N: 36, penRadius: 0.7, drawingRadius: 380, tilt: 0, name: 'star-8', difficulty: 3},
	{M: 120, N: 24, penRadius: 1.1, drawingRadius: 300, tilt: Math.PI / 4, name: 'pentagon', difficulty: 4},
	{M: 96, N: 32, penRadius: -1.2, drawingRadius: 380, tilt: Math.PI / 6, name: 'trillium-swoop', difficulty: 5},
	{M: 96, N: 24, penRadius: 1.3, drawingRadius: 320, tilt: Math.PI /2, name: 'box', difficulty: 6}, // pretty
	{M: 96, N: 48, penRadius: 1.8, drawingRadius: 600, tilt: 0, name: 'flyby-orbit', difficulty: 10},
	{M: 96, N: 21, penRadius: 2.7, drawingRadius: 700, tilt: 0, name: 'fast-swoop', difficulty: 11}

	*/