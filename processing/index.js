class Game {
    constructor() {
        createCanvas(window.innerWidth, window.innerHeight)

        this.stats = new Stats()
        this.subdivisionSlider = document.getElementById('subdivisions')
        this.sizeSlider = document.getElementById('size')
        this.rotationSlider = document.getElementById('rotation')
        this.edgesCheckbox = document.getElementById('edges')
        this.frame = 0
        this.cube = null
        this.rotationSpeed = parseFloat(this.rotationSlider.value)

        this.initGui()
        this.init3dObject(parseFloat(this.subdivisionSlider.value))

        document.body.appendChild(this.stats.dom)
    }

    initGui() {
        this.subdivisionSlider.oninput = (e) => {
             this.init3dObject(parseFloat(e.target.value))
        }

        this.sizeSlider.oninput = (e) => {
            this.cube.scale = parseFloat(e.target.value)
        }

        this.rotationSlider.oninput = (e) => {
            this.rotationSpeed = parseFloat(e.target.value)
        }

        this.edgesCheckbox.onchange = (e) => {
            this.cube.drawEdges = e.target.checked
        }
    }

    init3dObject(subdivisions) {
        let cubeInfos = this.generateCube(subdivisions)

        this.cube = new LEDCube()
        this.cube.x = width * 0.5
        this.cube.y = height * 0.5
        this.cube.z = 1
        this.cube.vertices = cubeInfos.vertices
        this.cube.edges = cubeInfos.edges
        this.cube.scale = parseFloat(this.sizeSlider.value)
        this.cube.drawEdges = this.edgesCheckbox.checked

        this.cube.rotateAroundX(0.3)
        this.cube.rotateAroundY(0.2)
    }

    generateCube(subdivisions) {
        if (subdivisions === undefined) {
            subdivisions = 0
        }

        let vertexIndex = 0
        let vertices = []
        let edges = []

        let nVerticesPerSide = 2 + subdivisions

        for (let z = 0; z < nVerticesPerSide; z++) {
            for (let y = 0; y < nVerticesPerSide; y++) {
                for (let x = 0; x < nVerticesPerSide; x++) {
                    vertices.push({
                        x: map(x, 0, nVerticesPerSide - 1, -1, 1),
                        y: map(y, 0, nVerticesPerSide - 1, -1, 1),
                        z: map(z, 0, nVerticesPerSide - 1, -1, 1)
                    })

                    if (x > 0) {
                        // connect to left
                        edges.push([vertexIndex, vertexIndex - 1])
                    }
                    if (y > 0) {
                        // connect down
                        edges.push([vertexIndex, vertexIndex - nVerticesPerSide])
                    }
                    if (z > 0) {
                        // connect next layer
                        edges.push([vertexIndex, vertexIndex - nVerticesPerSide * nVerticesPerSide])
                    }

                    vertexIndex++
                }
            }
        }

        return {
            vertices: vertices,
            edges: edges
        }
    }

    draw() {
        this.frame++
        background(10, 10, 10)

        //translate(width * 0.5, height * 0.5)

        this.cube.rotateAroundX(0.007 * this.rotationSpeed)
        this.cube.rotateAroundZ(0.007 * this.rotationSpeed)
        this.cube.rotateAroundY(sin(this.frame * 0.01) * 0.005  * this.rotationSpeed)
        this.cube.draw()

        this.stats.update()
    }
}
