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

    // toString(){
    //     var ret = "[";
    //     for (let i = 1; i < 4; i++) {
    //         let circ = this.dict[i]
    //         var chunk = "[";
    //         circ.forEach((char) =>{
    //             var bit = "["+char.getName()+","+char.complimentMe()+","+char.helpMe()+","+char.inviteMe()+"]";
    //             chunk += bit;
    //         });
    //         chunk += "]"
    //         ret += chunk;
    //     }
    //     ret += "]"
    //     return ret;
    // }

    toString(){
        var ret = "";
        for (let i = 1; i < 4; i++) {
            let circ = this.dict[i]
            circ.forEach((char) =>{
                ret += char.getName()+","+char.complimentMe()+","+char.helpMe()+","+char.inviteMe()+",";
            });
        }
        return ret; 
    }

    //no constructor overloading in javascript so this is what we are doing to get from string encoded back to game class
    static fromString(str){
        const arr = str.split(",");
        var char_lst = [];
        for (let i = 0; i < 36; i += 4){
            const n = arr[i];
            const c = parseInt(arr[i+1]);
            const h = parseInt(arr[i+2]);
            const inv = parseInt(arr[i+3]);
            char_lst.push(new Character(n, c, h, inv));
        }
        let c1 = char_lst.slice(0,3);
        let c2 = char_lst.slice(3,6);
        let c3 = char_lst.slice(6,9);
        return new Game(c1,c2,c3);
    }

    getCircle(c_num){
        return this.dict[c_num];
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
    toString(){
        return this.name+":"+this.compl+","+this.help+","+this.invite;
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
    return new Game(c1,c2,c3);
}

//export function stringEncodeToGame()
//test code to reuse when jest implemented
// const audi = new Character('audi',2,-1,3);
// const gaming = new Game([audi,audi,audi],[audi,audi,audi],[audi,audi,audi]);
// const stringify = gaming.toString();
// console.log(stringify);
// const gaming2 = Game.fromString(stringify);
// console.log(gaming2);