class LEDCube extends Fake3dObject {
    constructor() {
        super()

        this.drawEdges = false
    }

    draw() {
        push()

        translate(this.x, this.y)

        let zOrderedVertices = this.vertices.slice(0)
        zOrderedVertices.sort((a,b) => {
            return (a.z < b.z) ? 1 : -1
        })

        if (this.drawEdges) {
            noFill()
            stroke(255)
            strokeWeight(1)
            this.edges.forEach(edge => this.drawEdge(edge))
        }

        fill(255)
        stroke(0)
        strokeWeight(1)
        zOrderedVertices.forEach(vertex => this.drawLED(vertex))


        pop()
    }

    drawLED(vertex) {
        let vProj = this.getVertexProjection(vertex)
        ellipse(vProj.x, vProj.y, 15 - vertex.z * 4)
    }

    drawEdge(edge) {
        let v1 = this.getVertexProjection(this.vertices[edge[0]])
        let v2 = this.getVertexProjection(this.vertices[edge[1]])
        line(v1.x, v1.y, v2.x, v2.y)
    }
}
