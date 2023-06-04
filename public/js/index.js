import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#ffffff')

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 25
pointLight.position.y = 25
pointLight.position.z = 25
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffff, 1)
pointLight2.position.x = -100
pointLight2.position.y = 25
pointLight2.position.z = -100
scene.add(pointLight2)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let mixer
const clock = new THREE.Clock()
const loader = new GLTFLoader()
loader.loadAsync('assets/walking.glb')
    .then(function (glb) {
        const root = glb.scene
        root.scale.set(2, 2, 2)
        const animation = glb.animations[0]

        // Create a mixer to play the animation
        mixer = new THREE.AnimationMixer(root)

        // Create an animation action from the animation data
        const action = mixer.clipAction(animation)

        // Play the animation
        action.play()
        scene.add(root)
    })
    .catch(function (error) {
        console.error(error)
    })

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 20
camera.position.y = 4
camera.position.z = 20
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.update()
controls.enableDamping = true
controls.zoomSpeed = 0.8
controls.maxDistance = 20
controls.maxPolarAngle = 0.5 * Math.PI

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    gammaOutput: false // Disable gamma output
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

/**
 * Animate
 */
const tick = () => {
    // Update Orbital Controls
    controls.update()

    // Update animation
    if (mixer) {
        const delta = clock.getDelta()
        mixer.update(delta)
    }

    // Render scene
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()