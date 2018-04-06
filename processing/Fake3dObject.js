class Fake3dObject {
    constructor() {
        this.x = 0
        this.y = 0
        this.z = 1
        this.scale = 1
        this.vertices = []
        this.edges = []
    }

    draw() {
        push()

        translate(this.x, this.y)

        this.drawWireframe()

        pop()
    }

    drawWireframe() {
        noStroke()
        fill(255, 0, 0)
        ellipse(0, 0, 5)

        fill(255)
        this.vertices.forEach(vertex => this.drawWireframeVertex(vertex))

        noFill()
        stroke(255)
        strokeWeight(1)
        this.edges.forEach(edge => this.drawWireframeEdge(edge))
    }

    drawWireframeVertex(vertex) {
        let vertexProjection = this.getVertexProjection(vertex)
        ellipse(vertexProjection.x, vertexProjection.y, 5)
    }

    drawWireframeEdge(edge) {
        let v1 = this.getVertexProjection(this.vertices[edge[0]])
        let v2 = this.getVertexProjection(this.vertices[edge[1]])
        line(v1.x, v1.y, v2.x, v2.y)
    }

    getVertexProjection(vertex) {
        let mappedZ = map(this.z + vertex.z, 0, 10, 0.5, 1)
        return {
            x: (vertex.x / mappedZ) * this.scale,
            y: (vertex.y / mappedZ) * this.scale
        }
    }

    rotateAroundX(theta) {
        this.rotate(theta, {x:1, y:0, z:0})
    }

    rotateAroundY(theta) {
        this.rotate(theta, {x:0, y:1, z:0})
    }

    rotateAroundZ(theta) {
        this.rotate(theta, {x:0, y:0, z:1})
    }


    rotate(theta, axis) {
        let sin_half_t = Math.sin(theta / 2)
        let cos_half_t = Math.cos(theta / 2)

        this.vertices.forEach(pt => {
            /*
            q1: initial position and w = 0  ex: [0, x, y, z]
            q2: axis of rotation multiplied by the angle change (theta)
            q3: resulting position. Ignore w param of quaternion
            */
            let q1 = new Quaternion(0, pt.x, pt.y, pt.z)
            let q2 = new Quaternion(cos_half_t, axis.x * sin_half_t, axis.y * sin_half_t, axis.z * sin_half_t)
            let q3 = q2.mul(q1).mul(q2.conjugate())

            pt.x = q3.x
            pt.y = q3.y
            pt.z = q3.z
        })
    }
}
