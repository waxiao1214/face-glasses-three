var quat = new THREE.Quaternion();
var highlightedId = 'ip0';
var inputMode = 0;
var degr = false;
function matrixToString(m)
{
    var r = m.elements;
    var s = 
         '[ ' +toFixedWidth(r[0])+', '+toFixedWidth(r[4])+', '+toFixedWidth(r[8])+';\n'
        +'  ' +toFixedWidth(r[1])+', '+toFixedWidth(r[5])+', '+toFixedWidth(r[9])+';\n'
        +'  ' +toFixedWidth(r[2])+', '+toFixedWidth(r[6])+', '+toFixedWidth(r[10])+' ]';    
    return s;
}
function highlight(id)
{
    document.getElementById(highlightedId).classList.remove('phigh');
    highlightedId = id;
    document.getElementById(id).classList.add('phigh');
}
function setQ(q)
{
    q.normalize();
    quat = q;
    return doOutput();
}
function doOutput()
{
    var q = quat;
    var m = new THREE.Matrix4();
    m.makeRotationFromQuaternion(q);
    // document.getElementById("resmatrix").value = matrixToString(m);
    // document.getElementById("resq").value = '[ '+toReal(q.x)+', '+toReal(q.y)+', '+toReal(q.z)+', '+toReal(q.w)+' ]';
    
    var axis = [0, 0, 0];
    var angle = 2 * Math.acos(q.w);
    if (1 - (q.w * q.w) < 0.000001)
    {
        axis[0] = q.x;
        axis[1] = q.y;
        axis[2] = q.z;
    }
    else
    {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
        var s = Math.sqrt(1 - (q.w * q.w));
        axis[0] = q.x / s;
        axis[1] = q.y / s;
        axis[2] = q.z / s;
    }
    var eu = new THREE.Euler();
    eu.setFromRotationMatrix(m,"XYZ");
    
    var pose = [];
    for (let i = 0 ; i<3;i++){
        pose.push(toReal(toAngle(eu.toArray()[i])))
    }
    return pose;
}

function euler_ang_3(a1,a2,a3){
    var q = new THREE.Quaternion();
    var m = new THREE.Matrix4();
    var P = getVector(a1);
    var Q = getVector(a2);
    var R = getVector(a3);
    var x = new THREE.Vector3();
    var y = new THREE.Vector3();
    var z = new THREE.Vector3();
    x.subVectors(Q, P).normalize();
    y.subVectors(R, P);
    z.crossVectors(x, y).normalize();
    y.crossVectors(z, x).normalize();
    m.set(x.x, y.x, z.x, 1, x.y, y.y, z.y, 1, x.z, y.z, z.z, 1, 0, 0, 0, 1);
    q.setFromRotationMatrix(m);
    return setQ(q);

}

function getVector(a)
{
    return new THREE.Vector3(a[0], a[1], a[2]);
}
function toRad(x)
{
    if (document.getElementById("iformatdeg").checked)
    {
        return x / 180 * Math.PI;
    }
    else
    {
        return x;
    }
}
function toAngle(x)
{
    if (degr == true)
    {
        return x * 180 / Math.PI;
    }
    else
    {
        return x;
    }
}
function toReal(x){
	if (!isNaN(parseFloat(x)) && isFinite(parseFloat(x)))
	{
		return parseFloat(parseFloat(x).toFixed(7));
	}
	else
	{
		return x;
	}
}
function toFixedWidth(x){
	if (!isNaN(parseFloat(x)) && isFinite(parseFloat(x)))
	{
		var s = x.toFixed(7);
                if (x >= 0) s = ' ' + s;
                return s;
	}
	else
	{
		return x;
	}
}