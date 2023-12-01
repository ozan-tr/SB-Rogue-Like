const characterContainer = document.getElementById('characterContainer');
const mapsContainer = document.getElementById('mapsContainer');
const mobsContainer = document.getElementById('mobsContainer');
const mainContainer = document.querySelector('.mainContainer');

const loadingCanvas = document.createElement('canvas');
document.body.appendChild(loadingCanvas);

var totalScripts = 0;

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
        if (!sortedPaths[itemName]) {
            sortedPaths[itemName] = [item];
        } else {
            sortedPaths[itemName].push(item);
        }
    });

    for (const itemName of Object.keys(sortedPaths)) {
        const imgContainer = createDivContainer(itemName);
        loadImages(imgContainer, sortedPaths[itemName]);
        container.appendChild(imgContainer);
    }
}

var loadedScripts=0;

function drawLoadingBar(endAngle) {
    loadingCtx.clearRect(0, 0, loadingCanvas.width, loadingCanvas.height);

    loadingCtx.beginPath();
    loadingCtx.arc(loadingCanvas.width / 2, loadingCanvas.height / 2, loadingCanvas.width / 5, 0, 2 * Math.PI);
    loadingCtx.strokeStyle = 'gray';
    loadingCtx.lineWidth = 10;
    loadingCtx.stroke();

    loadingCtx.beginPath();
    loadingCtx.arc(loadingCanvas.width / 2, loadingCanvas.height / 2, loadingCanvas.width / 5, Math.PI/2, endAngle);
    loadingCtx.strokeStyle = 'aqua';
    loadingCtx.lineWidth = 10;
    loadingCtx.stroke();
}

function updateLoadingProgress() {
    loadedScripts++;
    endAngle = scale(loadedScripts, 1, totalScripts, Math.PI/2, 2 * Math.PI + Math.PI/2)
    drawLoadingBar(endAngle);

    console.log(loadedScripts, totalScripts);

    if (loadedScripts === totalScripts) {
        setTimeout(() => {
            loadingCanvas.style.display = 'none';
            mainMenu()
        },10);
    }
}

document.addEventListener("drag",(e)=>{e.preventDefault();});


// Your existing code...



loader.scripts().then(paths => {

    totalScripts = paths.length;

    loader.characters().then(chars => {
        totalScripts += chars.length;
        setTimeout(() => {
            sortAndLoad(characterContainer, chars);
        }, 50);
    });
    
    loader.maps().then(maps => {
        totalScripts += maps.length;
        setTimeout(() => {
            sortAndLoad(mapsContainer, maps);
        }, 50);
    });
    
    loader.mobs().then(mobs => {
        totalScripts += mobs.length;
        setTimeout(() => {
            sortAndLoad(mobsContainer, mobs);
        }, 50);
    });

    setTimeout(() => {
        paths.forEach(path => {
            const script = document.createElement('script');
            script.src = path;
            script.defer = true;
            document.body.appendChild(script);
            updateLoadingProgress();
        });
        
    }, 50);

});


function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}