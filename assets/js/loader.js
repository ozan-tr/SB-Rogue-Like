const characterContainer = document.getElementById('characterContainer');
const mapsContainer = document.getElementById('mapsContainer');
const mobsContainer = document.getElementById('mobsContainer');
const projectilesContainer = document.getElementById('projectilesContainer');
const mainContainer = document.querySelector('.mainContainer');
const dropsContainer = document.querySelector('.dropsContainer');

const loadingCanvas = document.createElement('canvas');
document.body.appendChild(loadingCanvas);

var loadedScripts = 0

loadingCanvas.width = 700;
loadingCanvas.height = 500;
const loadingCtx = loadingCanvas.getContext('2d');

function createImageElement(id, src) {
    const element = document.createElement('img');
    element.style.display = 'none';
    element.src = src;
    element.id = id;
    return element;
}

function createDivContainer(id) {
    const container = document.createElement('div');
    container.id = id;
    container.style.display = 'none';
    return container;
}

function loadImages(container, paths) {
    paths.forEach((path) => {
        const separated = path.split('\\');
        const id = separated[separated.length - 1].split('.')[0];
        const img = createImageElement(id, path);
        container.appendChild(img);
        updateLoadingProgress();
    });
}

function sortAndLoad(container, paths) {
    const sortedPaths = {};
    paths.forEach((item) => {
        const itemName = item.toString().split('\\')[3];
        sortedPaths[itemName] = sortedPaths[itemName] || [];
        sortedPaths[itemName].push(item);
    });

    for (const itemName of Object.keys(sortedPaths)) {
        const imgContainer = createDivContainer(itemName);
        loadImages(imgContainer, sortedPaths[itemName]);
        container.appendChild(imgContainer);
    }
}

function drawLoadingBar(endAngle) {
    loadingCtx.clearRect(0, 0, loadingCanvas.width, loadingCanvas.height);

    loadingCtx.beginPath();
    loadingCtx.arc(loadingCanvas.width / 2, loadingCanvas.height / 2, loadingCanvas.width / 5, 0, 2 * Math.PI);
    loadingCtx.strokeStyle = 'gray';
    loadingCtx.lineWidth = 10;
    loadingCtx.stroke();

    loadingCtx.beginPath();
    loadingCtx.arc(loadingCanvas.width / 2, loadingCanvas.height / 2, loadingCanvas.width / 5, Math.PI / 2, endAngle);
    loadingCtx.strokeStyle = 'aqua';
    loadingCtx.lineWidth = 10;
    loadingCtx.stroke();
}

function updateLoadingProgress(paths) {
    loadedScripts++;
    const endAngle = scale(loadedScripts, 1, totalScripts, Math.PI / 2, 2 * Math.PI + Math.PI / 2);
    drawLoadingBar(endAngle);

    if (loadedScripts === totalScripts) {
        setTimeout(() => {
            loadingCanvas.remove();
            mainMenu();
            loadItemsData(paths.filter((path) => path.includes("weapons")));
        }, 100);
    }
}

document.addEventListener("drag", (e) => { e.preventDefault(); });

var ItemsDict = [];

function loadItemsData(paths) {
    paths.forEach((path) => {
        fetch(path)
            .then(response => response.text())
            .then((data) => {
                const regex = /(?<=class )\w+/g;
                const items = data.match(regex);
                items.forEach((weapon) => {
                    const weaponClass = eval(weapon);
                    const weaponObj = new weaponClass();
                    ItemsDict.push(weaponObj);
                });
            });
    });
}

function loadScripts(paths) {
    return Promise.all(paths.map((path, index) => {
        const script = document.createElement('script');
        script.src = path;
        script.defer = true;
        document.body.appendChild(script);
        return new Promise((resolve) => {
            script.onload = () => resolve(index);
        });
    })).then((indexes) => {
        indexes.forEach((index) => {
            updateLoadingProgress(paths);
        });
    });
}

loader.scripts().then(paths => {
    totalScripts = paths.length;

    const firstLoad = paths.filter(path => path.includes("templateClasses"));
    const nonTemplateLoad = paths.filter(path => !path.includes("templateClasses"));

    return loadScripts(firstLoad).then(() => loadScripts(nonTemplateLoad));
}).then(() => {
    loader.characters().then(chars => sortAndLoad(characterContainer, chars));
    loader.maps().then(maps => sortAndLoad(mapsContainer, maps));
    loader.mobs().then(mobs => sortAndLoad(mobsContainer, mobs));
    loader.projectiles().then(projectiles => sortAndLoad(projectilesContainer, projectiles));
    loader.drops().then(drops => sortAndLoad(dropsContainer, drops));
});

function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
