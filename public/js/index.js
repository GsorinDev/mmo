import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Button
 **/
const shift = document.querySelector(".button-shift")
const z = document.querySelector("#z")
const q = document.querySelector("#q")
const s = document.querySelector("#s")
const d = document.querySelector("#d")

shift.style.background = "rgba(134,133,133,0.5)"
z.style.background = "rgba(134,133,133,0.5)"
q.style.background = "rgba(134,133,133,0.5)"
s.style.background = "rgba(134,133,133,0.5)"
d.style.background = "rgba(134,133,133,0.5)"

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
let mixers = [];
let actions = [];
let isAnimationPlaying = false;
let isAttack = false;
const clock = new THREE.Clock()
const loader = new GLTFLoader()
loader.loadAsync('assets/player.glb')
    .then(function (glb) {
        const root = glb.scene
        root.scale.set(2, 2, 2)

        glb.animations.splice(2).forEach((animation) => {
            mixer = new THREE.AnimationMixer(root)
            const action = mixer.clipAction(animation)
            mixers.push(mixer)
            actions.push(action)
        });
        console.log(actions)

        // Play the animation
        actions[4].play()
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
        mixers.forEach((mixer) => mixer.update(delta));
    }

    // Render scene
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}



document.addEventListener('keydown', function (event) {
    if (!isAnimationPlaying && !isAttack) {
        if (event.key === 'Shift') {
            // Changer de la première à la deuxième animation
            for (let i = 0; i < actions.length; i++) {
                actions[i].stop();
            }
            shift.style.background = "rgba(134,133,133,0.8)"
            actions[1].play();

        } else if (event.key === 'z') {
            z.style.background = "rgba(134,133,133,0.8)"
        }  else if (event.key === 'q') {
            q.style.background = "rgba(134,133,133,0.8)"
        } else if (event.key === 's') {
            s.style.background = "rgba(134,133,133,0.8)"
        } else if (event.key === 'd') {
            d.style.background = "rgba(134,133,133,0.8)"
        }
        isAnimationPlaying = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (isAnimationPlaying && !isAttack) {
        if (event.key === 'Shift') {
            // Arrêter la deuxième animation et revenir à la première
            for (let i = 0; i < actions.length; i++) {
                actions[i].stop();
            }
            shift.style.background = "rgba(134, 133, 133, 0.5)"
            actions[4].play();
        } else if (event.key === 'z') {
            z.style.background = "rgba(134,133,133,0.5)"
        } else if (event.key === 'q') {
            q.style.background = "rgba(134,133,133,0.5)"
        } else if (event.key === 's') {
            s.style.background = "rgba(134,133,133,0.5)"
        } else if (event.key === 'd') {
            d.style.background = "rgba(134,133,133,0.5)"
        }
        isAnimationPlaying = false;
    }
});

document.addEventListener('mousedown', function(event) {
    if (!isAnimationPlaying) {
        if (event.button === 2) { // Vérifie si le bouton gauche de la souris est enfoncé (valeur 0)
            // Changer de la première à la deuxième animation
            for (let i = 0; i < actions.length; i++) {
                actions[i].stop();
            }

            isAttack = true
            isAnimationPlaying = true;
            const clip = actions[2].getClip()
            actions[2].play()

            setTimeout(() => {
                actions[2].stop()
                actions[4].play()
                isAttack = false
                isAnimationPlaying = false
            }, clip.duration * 1000)


        }
    }
});



tick()

