function HashStorageFunc(){

    const self = this;

    let _recipes = {};

    self.addValue = function (key, value){
        _recipes[key] = value;
    }

    self.getValue = function (key){
        return _recipes[key];
    }

    self.deleteValue = function (key){

        if(key in _recipes){
            delete _recipes[key];
            return true;
        }

        return false;
    }

    self.getKeys = function(){

        return Object.keys(_recipes);
    }
}

let drinkStorage = new HashStorageFunc();

function setDrinkInfo() {
    let dName = prompt("Введите название напитка");
    let dType = confirm("Напиток алкогольный?");
    let dRecipe = prompt("Введите рецепт приготовления")

    drinkStorage.addValue(dName, {alcohol:dType, recipe:dRecipe});
}

function getDrinkInfo(){
    let dName = prompt("Введите название напитка");
    let value = drinkStorage.getValue(dName);

    if(value === undefined) 
        alert("Напиток отсутствует в рецептах");
    else
        alert("Название напитка: "  + dName + "\n" +
        "Тип напитка: " + (value.alcohol ? "Алкогольный" : "Безалкогольный") + "\n" +
        "Рецепт: " + value.recipe);
}

function deleteDrinkInfo(){
    let dName = prompt("Введите название напитка");
    let value = drinkStorage.deleteValue(dName);

    alert((value ? "Напиток удален" : "Напиток отсутствует (не удален)"));
}

function drinksList(){
    alert(drinkStorage.getKeys());
}

