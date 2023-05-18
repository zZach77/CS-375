let audio;
let analyser;

function play() {
  // Hide Play Button
  document.querySelector('button').style.display = 'none';

  // Audio
  audio = new Audio('./Ruchir - So I\'m Gone Ft. NGO & Croosh.mp3');
  audio.play();

  const context = new AudioContext();
  const source = context.createMediaElementSource(audio);
  analyser = context.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);
  analyser.connect(context.destination);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
  );
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const colors = [
    new THREE.Color(0xff0000),
    //new THREE.Color(0x12ee12),
    new THREE.Color(0x0000ff)
  ];

  // Sphere
  const geometry = new THREE.SphereGeometry(1, 32, 64);
  const material = new THREE.MeshStandardMaterial({
    color: colors[0],
    shininess: 100,
    emissive: 0x0,
    ambient: 0xffffff,
    specular: 0xffffff
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // Lights
  const pointLight1 = new THREE.PointLight(0xcccccc);
  pointLight1.position.set(15, 15, 15);
  const lightHelper1 = new THREE.PointLightHelper(pointLight1);

  const pointLight2 = new THREE.PointLight(0xcccccc);
  pointLight2.position.set(-15, -15, 15);
  const lightHelper2 = new THREE.PointLightHelper(pointLight2);

  const pointLight3 = new THREE.PointLight(0xcccccc);
  pointLight3.position.set(-15, 15, 15);
  const lightHelper3 = new THREE.PointLightHelper(pointLight3);

  const pointLight4 = new THREE.PointLight(0xcccccc);
  pointLight4.position.set(15, -15, 15);
  const lightHelper4 = new THREE.PointLightHelper(pointLight4);

  const pointLight5 = new THREE.PointLight(0xcccccc);
  pointLight5.position.set(15, -15, -15);
  const lightHelper5 = new THREE.PointLightHelper(pointLight5);

  const pointLight6 = new THREE.PointLight(0xcccccc);
  pointLight6.position.set(-15, 15, -15);
  const lightHelper6 = new THREE.PointLightHelper(pointLight6);

  const pointLight7 = new THREE.PointLight(0xcccccc);
  pointLight7.position.set(-15, -15, -15);
  const lightHelper7 = new THREE.PointLightHelper(pointLight7);

  const pointLight8 = new THREE.PointLight(0xcccccc);
  pointLight8.position.set(15, 15, -15);
  const lightHelper8 = new THREE.PointLightHelper(pointLight8);

  const ambientLight = new THREE.AmbientLight(0xcccccc, 1.0);

  const spotLight = new THREE.SpotLight(0xcccccc);
  spotLight.intensity = 0.9;
  spotLight.position.set(-10, 40, 20);
  spotLight.lookAt(sphere);
  spotLight.castShadow = true;

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  const gridHelper = new THREE.GridHelper(250, 50);

  scene.add(
    pointLight1, 
    pointLight2, 
    pointLight3,
    pointLight4,
    pointLight5,
    pointLight6,
    pointLight7,
    pointLight8,
    ambientLight
  );

  // Orbit Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enableRotate = true;
  controls.enablePan = false;
  controls.rotateSpeed = 0.5;

  // Group for particles
  const group = new THREE.Group();

  function addParticles() {
    const geometry = new THREE.SphereGeometry(.05, 24, 24);
    const material = new THREE.MeshStandardMaterial({color: 0xffffff});
    const particle = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => 
        THREE.MathUtils.randFloatSpread(100)
    );

    particle.position.set(x, y, z);
    group.add(particle);
  }

  // adding particles to the scene
  Array(750).fill().forEach(addParticles);

  // Add particle group to scene
  scene.add(group);

  // adding galaxy texture to scene
  const galaxyTexture = new THREE.TextureLoader().load('./Galaxy.jpeg');
  scene.background = galaxyTexture;

  let currentColorIndex = 0;

  function animateColor() {
    const startColor = colors[currentColorIndex];
    // Wrap around to the first color when reaching the end
    const endColor = colors[(currentColorIndex + 1) % colors.length]; 
    // Transition duration in milliseconds
    const duration = 7000; 
    const startTime = Date.now();

    function update() {
      const elapsed = Date.now() - startTime;
      // Normalized time (0 to 1)
      const t = Math.min(1, elapsed / duration); 

      const color = new THREE.Color().lerpColors(startColor, endColor, t);
      material.color = color;

      if (t === 1) {
        // Move to the next color
        currentColorIndex = (currentColorIndex + 1) % colors.length; 
        // Start the next color transition
        animateColor(); 
      } else {
        // Continue the animation
        requestAnimationFrame(update); 
      }
    }

    update();
  }

  animateColor();

  // Animate
  function animate() {
    requestAnimationFrame(animate);

    // visualizing sphere w audio
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const scale = (data[0] / 255) * 1.5 + 1;
    sphere.scale.set(scale, scale, scale);

    // Rotate camera around x-axis
    const time = Date.now() * 0.0006;
    camera.position.x = Math.sin(time) * 5;
    camera.position.z = Math.cos(time) * 5;
    camera.lookAt(0, 0, 0);

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}