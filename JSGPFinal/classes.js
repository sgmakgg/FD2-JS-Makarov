export class GameStatistic{
    won = {key:'won', value: 0};
    lost = {key:'lost',value: 0};
    abandoned = {key:'abandoned', value: 0};

    //Best times
    casual = {key:'casual', value: '-:-'};
    medium = {key:'medium', value: '-:-'};
    hard = {key:'hard', value: '-:-'};

    //Cards stats
    matched = {key:'matched', value: 0};
    wrong = {key:'wrong', value: 0}

    getMutedInstance(){
        return new GameStatisticDefault();
    }
}

class GameStatisticDefault{
    constructor(){
        this._won = {key:'won', value: 0};
        this._lost = {key:'lost',value: 0};
        this._abandoned = {key:'abandoned', value: 0};

        //Best times
        this._casual = {key:'casual', value: '-:-'};
        this._medium = {key:'medium', value: '-:-'};
        this._hard = {key:'hard', value: '-:-'};

        //Cards stats
        this._matched = {key:'matched', value: 0};
        this._wrong = {key:'wrong', value: 0}
    }

    get won(){
        return this._won
    }
    get lost(){
        return this._lost
    }
    get abandoned(){
        return this._abandoned
    }
    get casual(){
        return this._casual
    }
    get medium(){
        return this._medium
    }
    get hard(){
        return this._hard
    }
    get matched(){
        return this._matched
    }
    get wrong(){
        return this._wrong
    }
}

export class DefaultAppState{
    constructor() {
        this._defaultStartScreenText = 'memo';
        this._defaultDifficulty = '';
        this._defaultTimer = 1000;
        this._defaultLevel = 0;
    }

    get defaultStartScreenText(){
        return this._defaultStartScreenText = 'memo';
    }
    get defaultDifficulty(){
        return this._defaultDifficulty = '';
    }
    get defaultTimer(){
        return this._defaultTimer = 1000;
    }
    get defaultLevel(){
        return this._defaultLevel = 0;
    }
}