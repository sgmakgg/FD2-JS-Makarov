/*
    Получение словоформы для числа

    function test() {
    const applesS=prompt('Сколько у вас яблок?');
    const apples=parseInt(applesS);
    alert( 'У вас ' + apples + ' ' + getNumWord(apples,'яблоко','яблока','яблок') + '!' );
}*/

function getNumWord(num,word1,word2,word5) {
    const dd=num%100;
    if ( (dd>=11) && (dd<=19) )
        return word5;
    const d=num%10;
    if ( d===1 )
        return word1;
    if ( (d>=2) && (d<=4) )
        return word2;
    return word5;
}

// округление до произвольного модуля
function roundMod(n,m) {
    return Math.round(n/m)*m;
}

// получение целого случайного числа в заданном диапазоне
function randomDiap(n,m) {
    return Math.floor(Math.random()*(m-n+1))+n;
}

// получение координат элемента относительно верхнего левого угла страницы
function getElementPos(elem) {
    var bbox=elem.getBoundingClientRect();
    return {
        left: bbox.left+window.pageXOffset,
        top: bbox.top+window.pageYOffset
    };
}

