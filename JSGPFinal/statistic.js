export function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

export function getValue(key) {
    return localStorage.getItem(key);
}

export function increaseScore(key) {
    setLocalStorage(key, parseInt(getValue(key)) + 1);
}

export function decreaseScore(key) {
    setLocalStorage(key, parseInt(getValue(key)) - 1);
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
        '<h2>Figures: <span>' + '<b>' + getValue('flip_won') + '</b><i>Won</i>' +
        '<b>' + getValue('flip_lost') + '</b><i>Lost</i>' +
        '<b>' + getValue('flip_abandoned') + '</b><i>Abandoned</i></span>' +
        '</h2>' +
        '<ul>' +
        '<li>' +
        '<b>Best Casual:</b> <span>' + toTime(getValue('flip_casual')) + '</span>' +
        '</li>' +
        '<li>' +
        '<b>Best Medium:</b> <span>' + toTime(getValue('flip_medium')) + '</span>' +
        '</li>' +
        '<li>' +
        '<b>Best Hard:</b> <span>' + toTime(getValue('flip_hard')) + '</span>' +
        '</li>' +
        '</ul>' +
        '<ul>' +
        '<li>' +
        '<b>Total Flips:</b> <span>' + parseInt((parseInt(getValue('flip_matched'))
            + parseInt(getValue('flip_wrong'))) * 2) + '</span>' +
        '</li>' +
        '<li>' +
        '<b>Matched Flips:</b> <span>' + getValue('flip_matched') + '</span>' +
        '</li>' +
        '<li>' +
        '<b>Wrong Flips:</b> <span>' + getValue('flip_wrong') + '</span>' +
        '</li>' +
        '</ul>' +
        '</div>';
}