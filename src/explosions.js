const blackbodyColors = [ // blackbody radiation colors for 1000-10000K
    '#ff0000',
    '#ff1800',
    '#ff3800',
    '#ff5300',
    '#ff6500',
    '#ff7300',
    '#ff7e00',
    '#ff8912',
    '#ff932c',
    '#ff9d3f',
    '#ffa54f',
    '#ffad5e',
    '#ffb46b',
    '#ffbb78',
    '#ffc184',
    '#ffc78f',
    '#ffcc99',
    '#ffd1a3',
    '#ffd5ad',
    '#ffd9b6',
    '#ffddbe',
    '#ffe1c6',
    '#ffe4ce',
    '#ffe8d5',
    '#ffebdc',
    '#ffeee3',
    '#fff0e9',
    '#fff3ef',
    '#fff5f5',
    '#fff8fb',
    '#fef9ff',
    '#f9f6ff',
    '#f5f3ff',
    '#f0f1ff',
    '#edefff',
    '#e9edff',
    '#e6ebff',
    '#e3e9ff',
    '#e0e7ff',
    '#dde6ff',
    '#dae4ff',
    '#d8e3ff',
    '#d6e1ff',
    '#d3e0ff',
    '#d1dfff',
    '#cfddff',
    '#cedcff',
    '#ccdbff',
];

const TAU = 2 * Math.PI;

export default class ExplosionCollection {
	 constructor(context, fieldWidth=640, fieldHeight=640) {
		this.context = context;
		this.fieldWidth = fieldWidth;
		this.fieldHeight = fieldHeight;
		this.centerX = fieldWidth / 2;
		this.centerY = fieldHeight / 2;
        this.maxAge = blackbodyColors.length - 1;
        this.explosions = [];
        this.maxColor = blackbodyColors.length - 1;
    }

    add(x,y,scale=1.0) {
        this.explosions.push({x: x, y: y, scale: scale, age: 0});
    }

    update() {
        for(let i=this.explosions.length-1; i>=0; i--) {
            if(this.explosions[i].age++ >= this.maxAge) {
                this.explosions.splice(i,1);
            }
        } 
    }

    clear() {
        this.explosions = [];
    }

    drawNext() {
        const ctx = this.context;
		ctx.save();
		

		for(let i=0; i<this.explosions.length; i++){

            let explosion = this.explosions[i];
            let radius = explosion.age;
            let color = blackbodyColors[this.maxColor - explosion.age];


            ctx.beginPath();
            ctx.arc(explosion.x, explosion.y, radius * explosion.scale, 0, TAU, false);
            ctx.fillStyle =color;
            ctx.globalAlpha = (this.maxAge-explosion.age) / explosion.age;
            ctx.fill();
            /*
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#003300';
            ctx.stroke();
            */
        }
        ctx.restore();
    }
};





