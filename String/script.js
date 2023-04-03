const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const nodeCount = 20; //Nuber of nodes
const nodeSpacing = canvas.height/(nodeCount-1)
const OriginalNodes = []; //Initial Value of nodes for reference
var nodes = []; //List of nodes
const nodeRadius = 4;

for (let i = 0; i < nodeCount; i++) {
	nodes.push({
			x: canvas.width/2,
			y: i *nodeSpacing
	});
	OriginalNodes.push({
		x: canvas.width/2,
		y: i *nodeSpacing
});
}

let isDragging = false;
let draggedNode = null;
let draggedNodeIndex = 0
canvas.addEventListener('mousedown', event => {
	nodes.forEach((node,index) => {
		const distance = Math.sqrt((node.x - event.offsetX*2) ** 2 + (node.y - event.offsetY*2) ** 2);
		if (distance <= 2*nodeRadius) {
			isDragging = true;
			draggedNode = node;
			draggedNodeIndex = index/(nodeCount-1);
		}
	});
});

canvas.addEventListener('mousemove', event => {
	if (isDragging && draggedNode) {
		mPosX = 2* event.offsetX;
		mPosY = 2* event.offsetY;
		
		nodes.forEach((node, index) => {
			let t = index/(nodeCount-1) ;
			node.x = Math.pow(1-t,2) * nodes[0].x + 2*t*(1-t) * mPosX + Math.pow(t,2) * nodes[nodes.length - 1].x
			node.y = Math.pow(1-t,2) * nodes[0].y + 2*t*(1-t) * mPosY + Math.pow(t,2) * nodes[nodes.length - 1].y
		});
			
			drawNodesAndLines();
	}
});

canvas.addEventListener('mouseup', event => {
	isDragging = false;
	draggedNode = null;
	
	// Vibrate the nodes for 500 milliseconds
	const vibrationDuration = 500;
	const vibrationInterval = 10;
	const numVibrations = vibrationDuration / (2 * vibrationInterval);
	let vibrationCount = 0;
	const vibrationIntervalId = setInterval(() => {
		vibrationCount++;
		if (vibrationCount > numVibrations) {
			clearInterval(vibrationIntervalId);
			// Set nodes back to original position
			nodes.forEach((node, index) => {
				node.x = OriginalNodes[index].x;
				node.y = OriginalNodes[index].y;
			});
			drawNodesAndLines();
			return;
		}
		nodes.forEach((node, index) => {
			let t = index / (nodeCount - 1);
			node.x = OriginalNodes[index].x + Math.sin(2 * Math.PI * vibrationCount / numVibrations) * nodeRadius * Math.sin(2 * Math.PI * t);
			node.y = OriginalNodes[index].y;
		});
		drawNodesAndLines();
	}, vibrationInterval);

});

function drawNodesAndLines() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();
	nodes.forEach((node, index) => {
		context.moveTo(node.x, node.y);
		if (index < nodes.length - 1) {
			context.lineTo(nodes[index + 1].x, nodes[index + 1].y);
		}
	});
	context.stroke();

	nodes.forEach(node => {
		context.beginPath();
		context.arc(node.x, node.y, 5, 0, 2 * Math.PI);
		context.fill();
	});
}

drawNodesAndLines();
