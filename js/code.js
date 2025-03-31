// Game type stores a list of 3 triplets of characters
export class Game {
    //CONSTRUCTOR
    //Each circle input should be an array of 3 characters
    constructor(circle1, circle2, circle3){
        this.dict = {
            1:circle1,
            2:circle2,
            3:circle3
        }
    };
    
    score(c_num, action){
        //error handle c_num must be 1, 2, or 3
        const arr = [1,2,3]
        if(!arr.includes(c_num)){
            throw new Error("Unacceptable cnum value. Circle number must be 1, 2, or 3.")
        }
        var ret = 0;
        if(action == "compliment"){
            this.dict[c_num].forEach((ch) => {
                ret += ch.complimentMe();
            });
            return ret;
        }else if(action == "help"){
            this.dict[c_num].forEach((ch) => {
                ret += ch.helpMe();
            });
            return ret;
        }else if(action == "invite"){
            this.dict[cnum].forEach((ch) => {
                ret += ch.inviteMe();
            });
            return ret;
        }else{ //error handle unacceptable action string
           throw new Error("Action unknown. Options are compliment, help, and invite");
        }
    }
}

export class Character {
    //CONSTRUCTOR
    constructor(compl,help,invite){
        this.compl = compl;
        this.help = help;
        this.invite = invite;
    }
    //METHODS
    //getter methods to return associated happiness score per action
    complimentMe() {
        return this.compl;
    }
    helpMe() {
        return this.help;
    }
    inviteMe() {
        return this.invite;
    }
}

const audi = new Character(2,-1,3)
const gaming = new Game([audi,audi,audi],[audi,audi,audi],[audi,audi,audi])
console.log(gaming.score(1, "compliment"))