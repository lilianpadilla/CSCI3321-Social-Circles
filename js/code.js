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
        if(["Compliment","compliment","C","c"].includes(action)){
            this.dict[c_num].forEach((ch) => {
                ret += ch.complimentMe();
            });
            return ret;
        }else if(["Help","help","H","h".includes(action)]){
            this.dict[c_num].forEach((ch) => {
                ret += ch.helpMe();
            });
            return ret;
        }else if(["Invite","invite","I","i"].includes(action)){
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
    constructor(name,compl,help,invite){
        this.name = name;
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
    getName(){
        return this.name;
    }
}

export function newGame(char_lst){
    //ChatGPT generated function to shuffle characters & assign circles randomly
    for (let i = char_lst.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [char_lst[i], char_lst[j]] = [char_lst[j], char_lst[i]];
    }
    let c1 = char_lst.slice(0,3);
    let c2 = char_lst.slice(3,6);
    let c3 = char_lst.slice(6,9);
    return [c1,c2,c3]
}
//test code to reuse when jest implemented
//const audi = new Character(2,-1,3)
//const gaming = new Game([audi,audi,audi],[audi,audi,audi],[audi,audi,audi])
//console.log(gaming.score(1, "compliment"))