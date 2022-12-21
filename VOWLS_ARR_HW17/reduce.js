function vowelsCounterReduce(text){
    let russianVowels = {'а': 0, 'у': 0, 'о': 0, 'ы': 0, 'и': 0, 'э': 0, 'я': 0, 'ю': 0, 'ё': 0, 'е': 0};
    let arr = text.toLowerCase().split('');

    return arr.reduce((cnt, vowel) => {
        if (vowel in russianVowels)
            cnt ++;
        return cnt;}, 0);
}