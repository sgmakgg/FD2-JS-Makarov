"use strict"

class HashStorageClass {

    #recipes = {};
    constructor() {

    }

    addValue(key, value){
        this.#recipes[key] = value;
    }

    getValue(key){
        return this.#recipes[key];
    }

    deleteValue(key){

        if(key in this.#recipes){
            delete this.#recipes[key];
            return true;
        }

        return false;
    }

    getKeys(){
        let arr = [];
        for (let recipesKey in this.#recipes) {
            arr.push(recipesKey);
        }
        return arr;
    }
}

let drinkStorage = new HashStorageClass();

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

