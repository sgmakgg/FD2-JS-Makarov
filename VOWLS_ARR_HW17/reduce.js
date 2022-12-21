function vowelsCounterReduce(text){
    let russianVowels = {'а': 0, 'у': 0, 'о': 0, 'ы': 0, 'и': 0, 'э': 0, 'я': 0, 'ю': 0, 'ё': 0, 'е': 0};
    let countedString = text.toLowerCase();

    let arr = countedString.split('');
    let result = arr.reduce((russianVowels, vowel) => {
            russianVowels[vowel]++;
        return russianVowels;},
        russianVowels);

    let cnt = 0;
    for (const key in result) {
        if(!isNaN(result[key]))
            cnt += result[key];
    }

    return cnt;
}