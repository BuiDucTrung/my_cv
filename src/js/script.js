import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import bg2 from "../image/bg_part_002.jpg";
import bg4 from "../image/bg_part_004.jpg";
import bg5 from "../image/bg_part_005.jpg";
import bg6 from "../image/bg_part_006.jpg";
import iconLngActive from "../image/icon_lng_active.svg";
import iconLngInactive from "../image/icon_lng_inactive.svg";
import { gsap } from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import Typewriter from "typewriter-effect/dist/core";
import { isMobile, dataEng, dataVi, changeLanguage } from "./common";
import i18next from "i18next";

const fantasyBookUrl = new URL("../model/medieval_fantasy_book.glb", import.meta.url);
const phoenixBird1 = new URL("../model/phoenix_bird.glb", import.meta.url);

const etrian = new URL("../model/etrian_odyssey_3_monk.glb", import.meta.url);
const witch = new URL("../model/witchapprentice.glb", import.meta.url);
const shibahu = new URL("../model/shibahu.glb", import.meta.url);

i18next.init({
  fallbackLng: "en",
  debug: true,
  resources: {
    en: {
      ...dataEng,
    },

    vi: {
      ...dataVi,
    },
  },
});

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

//css2drender
let labelRenderer;
function createLabelRenderer() {
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";

  labelRenderer.domElement.setAttribute("id", "label_renderer");
  document.body.appendChild(labelRenderer.domElement);
}

// const axesHelper = new THREE.AxesHelper(5);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// scene.add(axesHelper);
scene.receiveShadow = true;
//rotate screen, can see from somewhere like top, bottom, right, left
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.22;
// controls.enableZoom = false;

//smooth camera zoomin by TrackballControls
const control2 = new TrackballControls(camera, renderer.domElement);
control2.noRotate = true;
control2.noPan = true;
control2.noZoom = false;
control2.zoomSpeed = 1.0;
// control2.staticMoving = true;

const control3 = new FirstPersonControls(camera, renderer.domElement);
control3.movementSpeed = 10.0;
control3.lookSpeed = 0.02;
control3.activeLook = false;
control3.mouseDragOn = false;
control3.autoForward = false;
control3.lookVertical = false;

camera.position.set(0, 20, 45);

const directionalLight = new THREE.DirectionalLight(0xffffff, 6.8);
scene.add(directionalLight);
directionalLight.position.set(30, 10, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1512; // default
directionalLight.shadow.mapSize.height = 1512; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 1500; // default
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;

scene.fog = new THREE.FogExp2(0xffffff, 0.003);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([bg4, bg6, bg2, bg2, bg2, bg5], function () {});

//select object from the scene
const mousePosition = new THREE.Vector2();
window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

//loading threeJs
const progressBar = document.getElementById("progres-bar");
const progressBarContainer = document.querySelector(".progres-bar-container");
const gltfLoader = new THREE.LoadingManager();
gltfLoader.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
};

gltfLoader.onLoad = function () {
  progressBarContainer.style.display = "none";
};

//load model
const gltf = new GLTFLoader(gltfLoader);

let mixer;
if (fantasyBookUrl) {
  gltf.load(fantasyBookUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.scale.set(0.5, 0.5, 0.5);
    model.traverse(function (node) {
      const nodeNames = [
        // "deers_Texture-base_0",
        // "Waterfall_Texture-base-gloss-jpg_0",
        // "1",
        // "0",
        // "Mill-water-wheel_Texture-base_0",
        // "Mill-wind-wheel_Texture-base_0",
        // "Scene_Book-tittle_0",
        // "Scene_Texture-base-gloss-jpg_0",
        // "Scene_Texture-base_0_1",
        "Scene_Texture-base_0",
      ];
      if (nodeNames.includes(node.name)) {
        node.castShadow = false;
        node.receiveShadow = true;
      } else {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    const animations = gltf.animations;

    mixer = new THREE.AnimationMixer(model);
    const clip = THREE.AnimationClip.findByName(animations, "The Life");
    const action = mixer.clipAction(clip);
    action.play();
  });
}

let mixerBird;
let modelBird;
if (phoenixBird1) {
  gltf.load(phoenixBird1.href, function (gltf) {
    modelBird = gltf.scene;
    modelBird.position.set(-50, 0, -10);
    modelBird.rotation.set(0.5, 0, 0);
    modelBird.scale.set(0.015, 0.015, 0.015);
    modelBird.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
      }
    });
    // modelBird.castShadow = true;
    // modelBird.receiveShadow = true;

    scene.add(modelBird);
    mixerBird = new THREE.AnimationMixer(modelBird);
    const animations = gltf.animations;
    const clip = THREE.AnimationClip.findByName(animations, "Take 001");
    const action = mixerBird.clipAction(clip);
    // action.timeScale(0.5);

    // window.addEventListener("mousedown", );
    action.play();
  });
}

let mixerEtrian;
let mixerWitch;
let mixerShibahu;

gltf.load(etrian.href, function (gltf) {
  const etrian = gltf.scene;
  const etrianAni = gltf.animations;

  etrian.rotation.set(0, 0.5, 0);
  etrian.scale.set(1, 1, 1);
  etrian.position.set(5, 0, 14);
  // etrian.castShadow = true;
  etrian.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
    }
  });
  const clip = THREE.AnimationClip.findByName(etrianAni, "Scene");
  mixerEtrian = new THREE.AnimationMixer(etrian);
  const action = mixerEtrian.clipAction(clip);
  scene.add(etrian);
  action.play();
});

gltf.load(witch.href, function (gltf) {
  const witchSence = gltf.scene;
  const witchAnimation = gltf.animations;
  if (isMobile()) {
  } else {
  }

  witchSence.scale.set(0.05, 0.05, 0.05);
  witchSence.position.set(4, 0, -8);
  witchSence.rotation.set(0, 5, 0);
  const clip = THREE.AnimationClip.findByName(witchAnimation, "Take 001");
  mixerWitch = new THREE.AnimationMixer(witchSence);
  const action = mixerWitch.clipAction(clip);
  scene.add(witchSence);
  action.play();
  createLabelRenderer();

  createNoteLanguage();

  if (!isMobile()) {
    cameraAnimationPC();
  } else {
    cameraAnimationMobile();
  }
  actionEagle();
});

gltf.load(shibahu.href, function (gltf) {
  const shibahuSence = gltf.scene;
  const shibahuAni = gltf.animations;
  if (isMobile()) {
    shibahuSence.position.set(6.5, -0.1, 7);
  } else {
    shibahuSence.position.set(-13, 5, -13);
    shibahuSence.scale.set(1.2, 1.2, 1.2);
  }
  shibahuSence.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true;
    }
  });
  const clip = THREE.AnimationClip.findByName(shibahuAni, "Take 001");
  mixerShibahu = new THREE.AnimationMixer(shibahuSence);
  const action = mixerShibahu.clipAction(clip);
  scene.add(shibahuSence);
  action.play();
});

//gsap
const tl = gsap.timeline();
const tl2 = gsap.timeline();
const duration = 2;
const ease = "none";
let animationIsFinished = false;
let position = -10;

function animationModel(model, x, y, z, rest) {
  return [
    model.position,
    {
      x: x,
      y: y,
      z: z,
      duration,
      ease,
      ...rest,
    },
  ];
}

function rotateModel(model, x, y, z) {
  return [
    model.rotation,
    {
      x: x,
      y: y,
      z: z,
      duration,
      ease,
    },
  ];
}
//typewriter
let divContainer;

function createPartIntro() {
  // createLabelRenderer();
  const p = document.createElement("p");
  const div = document.createElement("div");
  div.addEventListener("pointerdown", (event) => {});
  div.appendChild(p);
  divContainer = new CSS2DObject(div);
  scene.add(divContainer);
  if (isMobile()) {
    div.className = "partIntroMobile";

    divContainer.position.set(5, 1, 0);
  } else {
    div.className = "partIntro";
    divContainer.position.set(6, 2, 0);
  }
  const typewriterIntro = new Typewriter(p, {
    loop: false,
    delay: 20,
    cursor: "<b>|</b>",
    deleteSpeed: 20,
  });
  const timeDelay = isMobile() ? 1000 : 3000;
  typewriterIntro
    .pauseFor(timeDelay)
    .typeString(
      `<span style='font-weight:bold'>${i18next.t("info")}</span><br> <span><b>${i18next.t("fullName")}</b>: Bùi Đức Trung </span> <br> <span><b>${i18next.t(
        "birthday"
      )}</b>: ${i18next.t("infoBirthday")}</span>  <br> <span><b>${i18next.t("Uni")}</b>: ${i18next.t("nameUni")}</span><br>`
    )
    .typeString("<span><b>GPA:</b></span>")
    .deleteChars(4)
    .typeString(`<span><b>${i18next.t("major")}:</b> ${i18next.t("nameMajor")} </span> <br>`)
    .typeString(`<span><b>Email:</b> <a href="mailto:trung.bui36898@gmail.com">Trung Bui</a> </span> <br>`)
    .typeString(
      `<span><b>Github: </b> <a
      href="https://github.com/BuiDucTrung" target="_blank">Github</a> </span> <br>`
    )
    .typeString(`<span><b>${i18next.t("labelPosAppliedFor")}:</b> ${i18next.t("posAppliedFor")} </span> <br>`)
    .start();
}

function createPartExperience() {
  // createLabelRenderer();
  const p = document.createElement("p");

  const div = document.createElement("div");
  div.appendChild(p);
  divContainer = new CSS2DObject(div);
  if (isMobile()) {
    div.className = "partExperienceMobile";
    divContainer.position.set(6.5, 1, -8);
  } else {
    div.className = "partExperience";
    divContainer.position.set(6, 1, -8);
  }
  scene.add(divContainer);
  const typewriterIntro = new Typewriter(p, {
    loop: false,
    delay: 20,
    cursor: "<b>|</b>",
    deleteSpeed: 20,
  });
  typewriterIntro
    .pauseFor(3500)
    .typeString(`<span style='font-weight:bold; text-align:center; '>${i18next.t("workExp")}</span><br><br>`)
    .typeString(`<span><b>04/2021 - 04/2022</b>: ${i18next.t("amela")} </span> <br>`)
    .typeString(`<span><b> &ensp; ${i18next.t("role")}</b>: ReactJs + NextJs developer </span> <br><br>`)
    .pauseFor(1000)
    .typeString(`<span><b>5/2022 - 7/2023</b>: ${i18next.t("sotatek")}</span><br> `)
    .typeString(`<span><b>&ensp; ${i18next.t("role")}</b>: ReactJs + NextJs + ThreeJs <br> &ensp; &ensp; developer</span>`)
    .start();
}
function createNoteLanguage() {
  const content = document.createElement("div");
  content.style.minHeight = "40px";
  const lngArray = ["vi", "en"];
  const optionsDiv = document.createElement("div");
  optionsDiv.className = "optionLng";
  lngArray.map((lng, id) => {
    const option = document.createElement("INPUT");
    const labelOption = document.createElement("label");
    const optionWrap = document.createElement("div");
    const icon = document.createElement("IMG");
    icon.className = `img${lng}`;

    optionWrap.appendChild(labelOption);

    optionWrap.appendChild(icon);

    labelOption.setAttribute("for", `optionLng${lng}`);

    option.setAttribute("type", "radio");
    option.setAttribute("name", "language");
    option.setAttribute("value", lng);
    option.id = `optionLng${lng}`;
    option.style.display = "none";
    if (lng === "vi") {
      labelOption.innerText = "Vietnamese";
      option.checked = true;
    } else if (lng === "en") {
      labelOption.innerText = "English";
    }

    // if (option.value === "vi") option.checked = true;

    if (option.checked) {
      icon.setAttribute("src", iconLngActive);
    } else {
      icon.setAttribute("src", iconLngInactive);
    }

    optionsDiv.appendChild(option);
    optionsDiv.appendChild(optionWrap);
  });

  const btn = document.createElement("div");
  btn.className = "confirmBtn";
  btn.innerText = "Confirm";

  btn.addEventListener("click", () => {
    const radioButtons = document.querySelectorAll('input[name="language"]');
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        changeLanguage(radioButton.value);
        break;
      }
    }
    position = -1;
    // scene.remove(divContainer);

    gsap.to(div, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        scene.remove(divContainer);
        position = 0;
      },
    });
  });

  const div = document.createElement("div");
  const notice = document.createElement("span");
  notice.className = "notice";
  notice.innerText = isMobile() ? `${i18next.t("noticeMobile")}` : `${i18next.t("notice")}`;
  div.appendChild(content);
  div.appendChild(optionsDiv);
  div.appendChild(btn);
  div.appendChild(notice);
  divContainer = new CSS2DObject(div);
  scene.add(divContainer);
  if (isMobile()) {
    div.className = "partLanguageMobile";
    divContainer.position.set(5.5, 2, 0);
  } else {
    div.className = "partLanguage";
    divContainer.position.set(0, 12, -3);
  }
  const typewriterIntro = new Typewriter(content, {
    loop: false,
    delay: 20,
    cursor: "",
    deleteSpeed: 20,
  });

  typewriterIntro
    .pauseFor(3000)
    .typeString(`<span style='font-weight:bold; text-align:center; '>${i18next.t("languageQues")}</span><br><br>`)
    .pauseFor(1000)
    .start();

  gsap.to(div, {
    opacity: 0.8,
    duration: 0.5,
    delay: 3,
    onComplete: function () {
      const radioButtons = document.querySelectorAll('input[name="language"]');
      for (const radioButton of radioButtons) {
        radioButton.addEventListener("click", () => {
          for (const radioBtn of radioButtons) {
            const iconLng = document.querySelector(`.img${radioBtn.value}`);
            if (radioBtn.checked === true) {
              iconLng.setAttribute("src", iconLngActive);
            } else {
              iconLng.setAttribute("src", iconLngInactive);
            }
          }
        });
      }
    },
  });
}
function createPartSkill() {
  const p = document.createElement("p");
  const div = document.createElement("div");

  div.appendChild(p);
  divContainer = new CSS2DObject(div);
  scene.add(divContainer);
  if (isMobile()) {
    div.className = "partSkillMobile";
    divContainer.position.set(4, 1, -8);
  } else {
    div.className = "partSkill";
    divContainer.position.set(-11, 7, -13);
  }
  const timeDelay = isMobile() ? 3000 : 9000;
  const typewriterIntro = new Typewriter(p, {
    loop: false,
    delay: 20,
    cursor: "<b>|</b>",
    deleteSpeed: 20,
  });
  typewriterIntro
    .pauseFor(timeDelay)
    .typeString(`<span style='font-weight:bold; text-align:center; '>${i18next.t("skill")}</span><br><br>`)
    .typeString(`<span><b>${i18next.t("basicSkill")}:</b> HTML, CSS, Js </span> <br>`)
    .typeString(`<span><b>${i18next.t("uiLib")}:</b> MUI, Ant, Tailwind, GSAP </span> <br>`)
    .typeString(`<span><b>${i18next.t("lib")}:</b> ReactJs, ThreeJs</span> <br>`)
    .typeString(`<span><b>${i18next.t("apiLib")}:</b> Tanstack, Axios, Socket, SWR </span> <br>`)
    .typeString(`<span><b>${i18next.t("formLib")}:</b> React hook form, formik </span> <br>`)
    .typeString(`<span><b>${i18next.t("english")}:</b> ${i18next.t("rateEl")}</span> <br>`)
    .typeString("<span><b>Framework JS:</b> NextJs</span> <br>")
    .typeString(`<span><b>${i18next.t("projectName")}:</b>${i18next.t("project")}</span> <br>`)
    .typeString(`<span><b>${i18next.t("projectTools")}:</b> Git, github</span> <br>`)
    .typeString(`<span><b>${i18next.t("projectProgress")}:</b> Agile scrum, Waterfall</span> <br>`)
    .typeString(`<span><b>${i18next.t("personalProjects")}:</b></span> <br>`)
    .typeString(
      `<span > &nbsp; &nbsp; <b>CV project:</b> <a id="linkCv"
  href="https://buiductrung.github.io/my_cv/" target="_blank">CV</a></span> <br>`
    )
    .typeString(
      `<span > &nbsp; &nbsp; <b>NextJs project:</b><a id=linkNextjs  href="https://eco-system-sigma.vercel.app/" target="_blank">NextJs</a></span> <br>`
    )
    .pauseFor(1000)

    .start();
}

function createPartAppreciation() {
  const p = document.createElement("p");
  const div = document.createElement("div");
  div.appendChild(p);
  divContainer = new CSS2DObject(div);
  scene.add(divContainer);
  div.className = "partApreciation";
  divContainer.position.set(0, 20, 10);
  const typewriterIntro = new Typewriter(p, {
    loop: true,
    delay: 20,
    cursor: "",
    deleteSpeed: 20,
  });
  typewriterIntro
    .pauseFor(3000)
    .typeString(`<span style='font-weight:bold; text-align:center; '>${i18next.t("thankful")}</span>`)
    .pauseFor(1000)
    .start();
}

function actionEagle() {
  tl.to(...animationModel(modelBird, -15, 15, 20))
    .to(...animationModel(modelBird, 0, 25, 30))
    .to(...animationModel(modelBird, 20, 22, 22))
    .to(...animationModel(modelBird, 35, 18, 10))
    .to(...animationModel(modelBird, 25, 14, 0))
    .to(...animationModel(modelBird, 20, 10, -10))
    .to(...animationModel(modelBird, 5, 0, -30))
    .to(...animationModel(modelBird, -10, -10, -50))
    .to(...animationModel(modelBird, -20, -20, -70))
    .to(...animationModel(modelBird, -35, -10, -35))
    .to(...animationModel(modelBird, -50, 0, -10))
    .repeat(-1);
  tl2
    .to(...rotateModel(modelBird, 0, 0.5, 0))
    .to(...rotateModel(modelBird, 0, 1, 0))
    .to(...rotateModel(modelBird, 0, 1.5, 0))
    .to(...rotateModel(modelBird, 0, 2, 0))
    .to(...rotateModel(modelBird, 0, 2.5, 0))
    .to(...rotateModel(modelBird, 0, 3, 0))
    .to(...rotateModel(modelBird, 0, 3.5, 0))
    .to(...rotateModel(modelBird, 0, 4.25, 0))
    .to(...rotateModel(modelBird, 0, 5, 0))
    .to(...rotateModel(modelBird, 0, 5.75, 0))
    .to(...rotateModel(modelBird, 0, 6.5, 0))
    .repeat(-1);
}

function cameraAnimationPC() {
  if (!animationIsFinished) {
    animationIsFinished = true;
    gsap.from(...animationModel(camera, -15, 10, 0));

    window.addEventListener("keydown", function (event) {
      // console.log("event", event);

      if (event.code === "Space") {
        switch (position) {
          case 0:
            position = -1;
            gsap.to(...animationModel(camera, 6, 1, 16, { ease: "power1.inOut", duration: 3 }));
            createPartIntro();
            setTimeout(() => {
              gsap.to(".partIntro", {
                opacity: 0.8,
                duration: 0.5,
                onComplete: function () {
                  position = 1;
                },
              });
            }, 3000);

            break;
          case 1:
            position = 2;
            gsap.to(".partIntro", {
              opacity: 0,
              duration: 0.5,
            });
            // console.log("partIntro", partIntro);
            break;
          case 2:
            position = -1;
            scene.remove(divContainer);

            gsap.to(...animationModel(camera, 5, 1, -6, { ease: "sin.out", duration: 3 }));
            createPartExperience();
            setTimeout(() => {
              gsap.to(".partExperience", {
                opacity: 0.8,
                duration: 0.5,
                onComplete: function () {
                  position = 3;
                },
              });
            }, 3000);

            break;
          case 3:
            position = 4;
            gsap.to(".partExperience", {
              opacity: 0,
              duration: 0.5,
            });
            break;
          case 4:
            position = -1;
            scene.remove(divContainer);
            let tl = gsap.timeline();
            tl.to(...animationModel(camera, -10, 1, 12, { ease: "sin.out", duration: 1 }));
            tl.to(...animationModel(camera, -10, 1, 0, { ease: "sin.out", duration: 2 }));
            tl.to(...animationModel(camera, -10, 9, -2, { ease: "sin.out", duration: 3 }));
            tl.to(...animationModel(camera, -13, 7, -10, { ease: "sin.out", duration: 3 }));

            createPartSkill();
            setTimeout(() => {
              gsap.to(".partSkill", {
                opacity: 0.8,
                duration: 0.5,
                onComplete: function () {
                  position = 5;
                },
              });
            }, 9000);
            setTimeout(() => {}, 18100);
            break;
          case 5:
            position = 6;

            gsap.to(".partSkill", {
              opacity: 0,
              duration: 0.5,
            });
            break;
          case 6:
            position = -1;

            scene.remove(divContainer);
            gsap.to(...animationModel(camera, 0, 20, 35, { ease: "sin.out", duration: 3 }));
            createPartAppreciation();
            break;
          case 7:
        }
      }
    });
  }
}

function cameraAnimationMobile() {
  if (!animationIsFinished) {
    gsap.to(...animationModel(camera, 5.5, 2, 18));
    window.addEventListener("touchstart", function (event) {
      switch (position) {
        case 0:
          position = -1;

          gsap.to(...animationModel(camera, 5, 1, 16, { ease: "power1.inOut", duration: 1 }));
          createPartIntro();
          setTimeout(() => {
            document.querySelector(".partIntroMobile").style.width = `${window.innerWidth}px`;
            document.querySelector(".partIntroMobile").style.height = `${window.innerHeight}px`;
            gsap.to(".partIntroMobile", {
              opacity: 0.8,
              duration: 0.5,
              onComplete: function () {
                position = 1;
              },
            });
          }, 1000);
          break;
        case 1:
          position = 2;
          gsap.to(".partIntroMobile", { opacity: 0, duration: 0.5 });
          gsap.to(".partIntroMobile", {
            width: 0,
            duration: 1,
          });
          // console.log("partIntro", partIntro);
          break;
        case 2:
          position = -1;
          scene.remove(divContainer);
          const step2Tl = gsap.timeline();
          step2Tl
            .to(...animationModel(camera, 7, 1, 16, { ease: "sin.out", duration: 1 }))
            .to(...animationModel(camera, 6.5, 1, 10, { ease: "sin.out", duration: 1 }));
          createPartExperience();
          setTimeout(() => {
            document.querySelector(".partExperienceMobile").style.width = `${window.innerWidth}px`;
            document.querySelector(".partExperienceMobile").style.height = `${window.innerHeight}px`;
            gsap.to(".partExperienceMobile", {
              opacity: 0.8,
              duration: 0.5,
              onComplete: function () {
                position = 3;
              },
            });
          }, 3000);
          break;
        case 3:
          position = 4;
          gsap.to(".partExperienceMobile", {
            opacity: 0,
            duration: 0.5,
          });
          gsap.to(".partExperienceMobile", {
            width: 0,
            duration: 1,
          });
          break;
        case 4:
          scene.remove(divContainer);
          position = -1;
          let tl = gsap.timeline();
          tl.to(...animationModel(camera, 6, 1, 10, { ease: "sin.out", duration: 1 }));
          tl.to(...animationModel(camera, 4, 1, -6, { ease: "sin.out", duration: 2 }));
          createPartSkill();
          setTimeout(() => {
            document.querySelector(".partSkillMobile").style.width = `${window.innerWidth}px`;
            document.querySelector(".partSkillMobile").style.height = `${window.innerHeight}px`;
            gsap.to(".partSkillMobile", {
              opacity: 0.8,
              duration: 0.5,
              onComplete: function () {
                position = 5;
              },
            });
          }, 3000);
          break;
        case 5:
          position = -1;
          gsap.to(".partSkillMobile", {
            opacity: 0,
            duration: 0.5,
            onComplete: function () {
              position = 6;
            },
          });
          gsap.to(".partSkillMobile", {
            width: 0,
            duration: 1,
          });
          break;
        case 6:
          position = 7;
          scene.remove(divContainer);
          gsap.to(...animationModel(camera, 0, 20, 45, { ease: "sin.out", duration: 3 }));
          createPartAppreciation();
          break;
      }
    });
  }
}

// const gui = new dat.GUI();

const options = {
  wireframe: false,
  speed: 0.01,
  shadow: true,
  //spotlight
  angle: 0.2,
  penumbra: 0,
  intensity: 10000,
  stepCoordinateLight: 0,
  intensityLight: 6.8,
};

const clock = new THREE.Clock();
const clockBird = new THREE.Clock();
const clockControls = new THREE.Clock();
const clockEtrian = new THREE.Clock();
const clockShibahu = new THREE.Clock();
function animate(time) {
  // console.log(stepCoordinateLight);
  if (labelRenderer) {
    labelRenderer.render(scene, camera);
  }
  control3.update(clockControls.getDelta());

  if (mixer) {
    mixer.update(clock.getDelta());
  }
  if (mixerBird) {
    mixerBird.update(clockBird.getDelta());
  }
  if (mixerEtrian) {
    mixerEtrian.update(clockEtrian.getDelta());
  }
  if (mixerWitch) {
    mixerWitch.update(clockEtrian.getDelta() * 30);
  }
  if (mixerShibahu) {
    mixerShibahu.update(clockShibahu.getDelta());
  }

  renderer.render(scene, camera);

  rayCaster.setFromCamera(mousePosition, camera);

  //update shadow
  directionalLight.position.set(Math.round(Math.cos(options.stepCoordinateLight) * 30 * 100) / 100, 30, 0);
  options.stepCoordinateLight = options.stepCoordinateLight + 0.001;

  //update intensity
  directionalLight.intensity = (Math.round(Math.cos(options.stepCoordinateLight) * 6.8 * 100) / 100 + 10) / 2;

  const intersects = rayCaster.intersectObjects(scene.children);

  //resize
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (labelRenderer) {
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }
  });
}

renderer.setAnimationLoop(animate);
