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

//Функция для получения реального имени класса объекта

function getClassName(obj) {
    if ( obj.constructor && obj.constructor.name )
        return obj.constructor.name;
    const c=Object.prototype.toString.apply(obj);
    return c.substring(8,c.length-1);
}

// форматирует дату-время в формате дд.мм.гггг чч:мм:сс
function formatDateTime(dt) {
    const year=dt.getFullYear();
    const month=dt.getMonth()+1;
    const day=dt.getDate();
    const hours=dt.getHours();
    const minutes=dt.getMinutes();
    const seconds=dt.getSeconds();
    return str0l(day,2) + '.' + str0l(month,2) + '.' + year + ' '
        + str0l(hours,2) + ':' + str0l(minutes,2) + ':' + str0l(seconds,2);
}

// дополняет строку val слева нулями до длины Len
function str0l(val,len) {
    let strVal=val.toString();
    while ( strVal.length < len )
        strVal='0'+strVal;
    return strVal;
}

// функция позволяет установить обработчик func,
// который не срабатывает слишком часто -
// если immediate=false - func будет вызван в конце серии событий,
// если immediate=true - func будет вызван в начале серии событий
// серия событий - последовательность событий,
// интервалы между которыми не превыщают interval миллисекунд
function debounceSerie(func,interval,immediate) {
    let timer;
    return function() {
        let context=this, args=arguments;
        let later=function() {
            timer=null;
            if ( !immediate )
                func.apply(context,args);
        };
        let callNow=immediate&&!timer;
        clearTimeout(timer);
        timer=setTimeout(later,interval);
        if ( callNow )
            func.apply(context,args);
    };
}


