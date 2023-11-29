const uiContainer = document.querySelector('.uiContainer');
let uiActive = false;
let gameActive = false;

const statsList = document.getElementById('statsList');

document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
        uiActive = !uiActive;
        if (uiActive) {
            activateUI();
        } else {
            deactivateUI();
        }
    }
});

function activateUI() {
    if(gameActive){
        uiContainer.classList.add('activateUi');
        updateStats();
    }
}

function deactivateUI() {
    uiContainer.classList.remove('activateUi');
}

function formatStatName(stat) {
    return stat.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function updateStats() {
    const stats = player.getStats();
    statsList.innerHTML = '';

    for (const stat in stats) {
        if (stats.hasOwnProperty(stat)) {
            const value = stats[stat];
            const formattedStatName = formatStatName(stat);
            const statElement = document.createElement('li');
            statElement.innerHTML = `<b>${formattedStatName}:</b> ${value}`;
            statElement.classList.add('statsListItem');
            statElement.style.listStyleImage = `url(assets/img/UI/statIcon/${stat}.png)`;
            statsList.appendChild(statElement);
        }
    }
}