class Game {
    constructor() {
        this.stats = new Stats()
        this.subdivisionSlider = document.getElementById('subdivisions')
        this.sizeSlider = document.getElementById('size')
        this.rotationSlider = document.getElementById('rotation')

        this.glslSandbox = new GlslSandbox(600, 600, null, 'shader.frag')
        this.glslSandbox.autoResize = false
        this.glslSandbox.on('geometry-initialization', (e) => this.geomInit(e.material, e.geometry))
        this.glslSandbox.on('pre-render', () => this.update())

        this.initGui()

        document.body.appendChild(this.glslSandbox.dom)
        document.body.appendChild(this.stats.dom)
    }

    geomInit(material, geometry) {
        material.uniforms.subdivisions = {
            type: 'i', value: this.subdivisionSlider.value
        }

        material.uniforms.meshScale = {
            type: 'f', value: this.sizeSlider.value
        }

        material.uniforms.rotationSpeed = {
            type: 'f', value: this.rotationSlider.value
        }
    }

    initGui() {
        this.subdivisionSlider.oninput = (e) => {
            this.glslSandbox.mesh.material.uniforms.subdivisions.value = e.target.value
        }

        this.sizeSlider.oninput = (e) => {
            this.glslSandbox.mesh.material.uniforms.meshScale.value = e.target.value
        }

        this.rotationSlider.oninput = (e) => {
            this.glslSandbox.mesh.material.uniforms.rotationSpeed.value = e.target.value
        }
    }

    update() {
        this.stats.update()
    }
}
