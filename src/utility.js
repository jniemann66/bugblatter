///////////////////////////////////////////////////////////////////////////////
// testLineCircleIntersection() : test whether a line intersects with a circle
// x0,y0 : first point on line
// x1,y1 : second point on line
// ox,oy : center of circle
// r: radius of circle
//
// return value:
//   < 0 : no intersection,
//   = 0 : tangent (hits circle at one point),
//   > 0 : intersection (secant; hits circle at two points)
//
// see: http://mathworld.wolfram.com/Circle-LineIntersection.html
//

function testLineCircleIntersection(x0,y0,x1,y1,ox,oy,r) {
	// normalize line co-ordinates
	x0 -= ox;
	y0 -= oy;
	x1 -= ox;
	y1 -= oy;

	// calculate discriminant
	let rSquared = r * r;
	let dx = x1 - x0;
	let dy = y1 - y0;
	let bigD = (x0 * y1 - x1 * y0);
	let bigDSquared = bigD * bigD;
	let lSquared = dx * dx + dy * dy;
	let discriminant = rSquared * lSquared - bigDSquared;
	return discriminant;
}

function isHeadedTowards(x0,y0,x1,y1,ox,oy) {
	let d0Squared = (x0-ox)*(x0-ox) + (y0-oy)*(y0-oy);
	let d1Squared = (x1-ox)*(x1-ox) + (y1-oy)*(y1-oy);
	return (d1Squared < d0Squared);
}

export { testLineCircleIntersection };
export { isHeadedTowards };