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

