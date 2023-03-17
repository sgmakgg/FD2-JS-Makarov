import {GameStatistic} from './classes.js';

const ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
const ajaxDataName = 'Makarov_Memo_Statistic';

let gameStatisticDefault = new GameStatistic().getMutedInstance();

export let gameStatistic = new GameStatistic();

let parsedStatistic;

export async function readStatistic() {
    let postBody = new URLSearchParams();
    postBody.append('f', 'READ');
    postBody.append('n', ajaxDataName);

    try {
        const response = await fetch(ajaxHandlerScript, {method: 'post', body: postBody});
        const serverResponseCode = response.status;
        console.log('READ Response: ' + serverResponseCode);
        if(serverResponseCode === 200){
            const data = await response.json();
            if(data.result !== '')
                mapData(data);
            else
                await insertStatistic();
        }
    }
    catch(error){
        console.error(error);
    }
}

function mapData(result) {
    parsedStatistic = JSON.parse(result.result);
    gameStatistic.won.value = parsedStatistic.won.value;
    gameStatistic.lost.value = parsedStatistic.lost.value;
    gameStatistic.abandoned.value = parsedStatistic.abandoned.value;
    gameStatistic.casual.value = parsedStatistic.casual.value;
    gameStatistic.medium.value = parsedStatistic.medium.value;
    gameStatistic.hard.value = parsedStatistic.hard.value;
    gameStatistic.matched.value = parsedStatistic.matched.value;
    gameStatistic.wrong.value = parsedStatistic.wrong.value;
}

export async function insertStatistic() {
    let json = JSON.stringify(gameStatisticDefault, null, 1);
    let postBody = new URLSearchParams();
    postBody.append('f', 'INSERT');
    postBody.append('n', ajaxDataName);
    postBody.append('v', json);

    const response = await fetch(ajaxHandlerScript, {method: 'post', body: postBody});
    const serverResponseCode = response.status;
    if (serverResponseCode === 200) {
        console.log('INSERT status: ' + serverResponseCode);
    }
}

let password;
export async function updateStatistic() {
    password = Math.random();
    let postBody = new URLSearchParams();
    postBody.append('f', 'LOCKGET');
    postBody.append('n', ajaxDataName);
    postBody.append('p', password);
    try {
        const response = await fetch(ajaxHandlerScript, {method: 'post', body: postBody});
        const serverResponseCode = response.status;
        console.log('LOCKGET Response: ' + serverResponseCode);
        if(serverResponseCode === 200){
            const data = await response.json();
            let json;
            if(data.result === ''){
                json = JSON.stringify(gameStatisticDefault, null, 1);
                await readyForUpdate(json);
            }
            else{
                json = JSON.stringify(gameStatistic, null, 1);
                await readyForUpdate(json);
            }
        }
    }
    catch(error){
        console.error(error);
    }
}

async function readyForUpdate(json) {
    let postBody = new URLSearchParams();
    postBody.append('f', 'UPDATE');
    postBody.append('n', ajaxDataName);
    postBody.append('p', password);
    postBody.append('v', json);
    const response = await fetch(ajaxHandlerScript, {method: 'post', body: postBody});
    if(response.status === 200)
        console.log('UPDATE Response: ' + response.status);
}

let toTime = function (value) {
    if (value === '-:-')
        return value;
    else {
        let time = ' ' + value / 1000 + ' ';
        return time.substr(0, time.length - 1) + 's';
    }
};

export function updateStats() {
    document.getElementById('stats').innerHTML = '' +
        '<div class="padded">' +
        '<h2>Figures: <span>' + '<b>' + gameStatistic.won.value + '</b><i>Won</i>' +
        '<b>' + gameStatistic.lost.value + '</b><i>Lost</i>' +
        '<b>' + gameStatistic.abandoned.value + '</b><i>Abandoned</i></span>' +
        '</h2>' +
        '<ul>' +
        '<li>' +
        '<b>Best Casual:</b> <span>' + toTime(gameStatistic.casual.value) + '</span>' +
        '</li>' +
        '<li>' +
        '<b>Best Medium:</b> <span>' + toTime(gameStatistic.medium.value) + '</span>' +
        '</li>' +
        '<li>' +
        '<b>Best Hard:</b> <span>' + toTime(gameStatistic.hard.value) + '</span>' +
        '</li>' +
        '</ul>' +
        '<ul>' +
        '<li>' +
        '<b>Total Flips:</b> <span>' + ((gameStatistic.matched.value
            + gameStatistic.wrong.value) * 2) + '</span>' +
        '</li>' +
        '<li>' +
        '<b>Matched Flips:</b> <span>' + gameStatistic.matched.value + '</span>' +
        '</li>' +
        '<li>' +
        '<b>Wrong Flips:</b> <span>' + gameStatistic.wrong.value + '</span>' +
        '</li>' +
        '</ul>' +
        '</div>';
}