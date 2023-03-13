const ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
const ajaxDataName = 'Makarov_Memo_Statistic';

let gameStatisticDefault = {
    won:{
        key:'won',
        value: 0},
    lost:{
        key:'lost',
        value: 0},
    abandoned:{
        key:'abandoned',
        value: 0},

    //Best times
    casual:{
        key:'casual',
        value: '-:-'},
    medium:{
        key:'medium',
        value: '-:-'},
    hard:{
        key:'hard',
        value: '-:-'},

    //Cards stats
    matched:{
        key:'matched',
        value: 0},
    wrong:{
        key:'wrong',
        value: 0}
}

export let gameStatistic = {
    won:{
        key:'won',
        value: 0},
    lost:{
        key:'lost',
        value: 0},
    abandoned:{
        key:'abandoned',
        value: 0},

    //Best times
    casual:{
        key:'casual',
        value: '-:-'},
    medium:{
        key:'medium',
        value: '-:-'},
    hard:{
        key:'hard',
        value: '-:-'},

    //Cards stats
    matched:{
        key:'matched',
        value: 0},
    wrong:{
        key:'wrong',
        value: 0}
}

let parsedStatistic;


export function readStatistic() {
    $.ajax(ajaxHandlerScript, { type:'POST', dataType:'json',
        data:{f:'READ',n:ajaxDataName},
        success:readStatisticReady, error:errorHandler }
    );
}
function readStatisticReady(result) {
    if(result.error === undefined && result.result !== ''){
        parsedStatistic = JSON.parse(result.result);
        gameStatistic.won.value = parsedStatistic.won.value;
        gameStatistic.lost.value = parsedStatistic.lost.value;
        gameStatistic.abandoned.value = parsedStatistic.abandoned.value;
        gameStatistic.casual.value = parsedStatistic.casual.value;
        gameStatistic.medium.value = parsedStatistic.medium.value;
        gameStatistic.hard.value = parsedStatistic.hard.value;
        gameStatistic.matched.value = parsedStatistic.matched.value;
        gameStatistic.wrong.value = parsedStatistic.wrong.value;

        // Fill stats
        if (gameStatistic.won.value > 0 || gameStatistic.lost.value > 0 || gameStatistic.abandoned.value > 0) {
            updateStats();
        }
    }
    else if(result.result === ''){
        insertStatistic();
    }
    else
        console.log('READ ' + result.error)
}
function errorHandler(jqXHR,statusStr,errorStr) {
    console.log(statusStr+' '+errorStr);
}

function insertStatistic(){
    $.ajax(ajaxHandlerScript, { type:'POST', dataType:'text',
        data:{f:'INSERT',n:ajaxDataName, v: JSON.stringify(gameStatisticDefault, null,1)},
        success:insertStatisticReady, error:errorHandler }
    );
}
function insertStatisticReady(result){
    console.log('INSERT ' + result.error)
}

let password;
export function updateStatistic(){
    password = Math.random();
    $.ajax(ajaxHandlerScript, { type:'POST', dataType:'text',
        data:{f:'LOCKGET',n:ajaxDataName, p:password},
        success:readyForUpdate, error:errorHandler }
    );
}
function readyForUpdate() {
    $.ajax(ajaxHandlerScript, {
        type: 'POST', dataType: 'text',
        data: {f: 'UPDATE', n: ajaxDataName, p: password, v: JSON.stringify(gameStatistic, null,1)},
        success: updateReady, error: errorHandler
    });
}
function updateReady(result){
    console.log('UPDATE ' + result.error);
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