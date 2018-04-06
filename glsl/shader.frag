#define PI 3.14159265359
#define PI2 6.28318530718
#define PI3 9.42477796077
#define PI4 12.5663706144

#define MAX_SUBDIVISIONS 15

uniform vec2 iResolution;
uniform float iTime;
uniform float iFrame;

uniform int subdivisions;
uniform float meshScale;
uniform float rotationSpeed;

// ===========================

float map(float v, float min1, float max1, float min2, float max2) {
    return min2 + ((max2 - min2) / (max1 - min1)) * (v - min1);
}

vec4 quaternion_mult(vec4 q1, vec4 q2) {
    return vec4(
        q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
        q1.w * q2.y + q1.y * q2.w + q1.z * q2.x - q1.x * q2.z,
        q1.w * q2.z + q1.z * q2.w + q1.x * q2.y - q1.y * q2.x,
        q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z
    );
}

vec4 quaternion_conjugate(vec4 q1) {
    return vec4(-q1.x, -q1.y, -q1.z, q1.w);
}

vec2 getVertexProjection(vec3 vertex) {
    float mappedZ = map(1.0 + vertex.z, 0.0, 10.0, 0.5, 1.0);
    return vec2(
        (vertex.x / mappedZ) * meshScale + iResolution.x * 0.5,
        (vertex.y / mappedZ) * meshScale + iResolution.y * 0.5
    );
}

float distanceSqr(vec2 p1, vec2 p2) {
    return (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
}

void rotate(inout vec3 pt, float theta, vec3 axis) {
    float sin_half_t = sin(theta / 2.0);
    float cos_half_t = cos(theta / 2.0);

    vec4 q1 = vec4(pt.x, pt.y, pt.z, 0.0);
    vec4 q2 = vec4(axis.x * sin_half_t, axis.y * sin_half_t, axis.z * sin_half_t, cos_half_t);
    vec4 q3 = quaternion_mult(quaternion_mult(q2, q1), quaternion_conjugate(q2));

    pt.x = q3.x;
    pt.y = q3.y;
    pt.z = q3.z;
}

void rotateAroundX(inout vec3 pt, float theta) {
    rotate(pt, theta, vec3(1.0, 0.0, 0.0));
}

void rotateAroundY(inout vec3 pt, float theta) {
    rotate(pt, theta, vec3(0.0, 1.0, 0.0));
}

void rotateAroundZ(inout vec3 pt, float theta) {
    rotate(pt, theta, vec3(0.0, 0.0, 1.0));
}

void main() {
    vec3 col = vec3(0.0);

    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    int nVerticesPerSide = 2 + subdivisions;

    vec3 pt;
    float colMultiplier;

    float glowMin = 0.0;
    float glowMax = 100.0;

    for (int z = 0; z < MAX_SUBDIVISIONS; z++) {
        for (int y = 0; y < MAX_SUBDIVISIONS; y++) {
            for (int x = 0; x < MAX_SUBDIVISIONS; x++) {

                colMultiplier = 0.0;

                pt = vec3(
                    map(float(x), 0.0, float(nVerticesPerSide) - 1.0, -1.0, 1.0),
                    map(float(y), 0.0, float(nVerticesPerSide) - 1.0, -1.0, 1.0),
                    map(float(z), 0.0, float(nVerticesPerSide) - 1.0, -1.0, 1.0)
                );

                rotateAroundY(pt, 0.6 * iTime * rotationSpeed);
                rotateAroundX(pt, 0.6 * iTime * rotationSpeed);

                vec2 ptProj = getVertexProjection(pt);

                float d = distanceSqr(ptProj, gl_FragCoord.xy);
                float zScale = 4.0 - (pt.z + 2.0);

                colMultiplier += (1.0 - smoothstep(4.0 * zScale, 25.0 * zScale, d));
                colMultiplier += (1.0 - smoothstep(0.0, 5000.0, d)) * 0.01;

                col += min(colMultiplier, 1.0) * vec3(
                    float(z) / float(nVerticesPerSide) + (sin(iTime) * 0.5),
                    float(y) / float(nVerticesPerSide) + (cos(iTime) * 0.5),
                    float(x) / float(nVerticesPerSide) + (sin(iTime + PI) * 0.5)
                );

                if (x > subdivisions) { break; }
            } // end for x
            if (y > subdivisions) { break; }
        } // end for y
        if (z > subdivisions) { break; }
    } // end for z

    gl_FragColor = vec4(vec3(col), 1.0);
 }
