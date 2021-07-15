const _ = require("lodash");
const games = [];

const id = function(coordinates) {
    return coordinates.x*8+coordinates.y;
}
const coordinatesById = function(id) {
    const x = Math.floor(id/8);
    const y = id%8;
    return {x:x, y:y};
}
const checkCoord = function(coord) {
    if (coord.x < 8 && coord.x >= 0 && coord.y < 8 && coord.y >= 0) {return true;}
    return false;
}
const generateGameId = function() {
    return Math.floor(Math.random() * (10000 - 1000) + 1000);
}

const pawnTransformation = function(figureFrom, from, to, game) {
    if (figureFrom.color == 'w' && to.x==0) {
        game.transformationId = id(to);
        return true;
    }
    if (figureFrom.color == 'b' && to.x==7) {
        game.transformationId = id(to);
        return true;
    }
    return false;
}

const cloneGame = function(from, to, figureFrom, figureTo, game) {
    let cloneGame = _.cloneDeep(game);
    for (let i in cloneGame.figures) {
        if (figureTo){if (figureTo.cellId===cloneGame.figures[i].cellId) {cloneGame.figures.splice(i, 1);}}
    }
    for (let i in cloneGame.figures) {
        if (cloneGame.figures[i].cellId===figureFrom.cellId) {
            cloneGame.figures[i].cellId = id(to);
        }
    }
    return cloneGame;
}
const checkKingAttack = function(game) {
    let gf = game.figures;
    let blackKing =_.find(game.figures, o => o.type==='king' && o.color==='b');
    let whiteKing =_.find(game.figures, o => o.type==='king' && o.color==='w');
    let res;
    let res_ = {whiteKingIsAttacked: false, blackKingIsAttacked: false, enemyForBlack: NaN, enemyForWhite: NaN};
    for (let i in gf) {
        let figure = gf[i];

        if (figure.type === 'queen' && figure.color==='w') {
            res = checkQueenMoveGeometry(coordinatesById(figure.cellId), coordinatesById(blackKing.cellId), blackKing, game).attack;}
        if (figure.type === 'pawn' && figure.color==='w') {
            res = checkPawnMoveGeometry(coordinatesById(figure.cellId), coordinatesById(blackKing.cellId), figure, blackKing, game).attack;}
        if (figure.type === 'horse' && figure.color==='w') {
            res = checkHorseMoveGeometry(coordinatesById(figure.cellId), coordinatesById(blackKing.cellId), blackKing, game).attack;}
        if (figure.type === 'bishop' && figure.color==='w') {
            res = checkBishopMoveGeometry(coordinatesById(figure.cellId), coordinatesById(blackKing.cellId), blackKing, game).attack;}
        if (figure.type === 'rook' && figure.color==='w') {
            res = checkRookMoveGeometry(coordinatesById(figure.cellId), coordinatesById(blackKing.cellId), blackKing, game).attack;}
        if (figure.type === 'king' && figure.color==='w') {
            res = checkKingMoveGeometry(coordinatesById(figure.cellId), coordinatesById(blackKing.cellId), blackKing, game).attack;}
        if (res) {
            res_.blackKingIsAttacked = true;
            res_.enemyForBlack = figure;
            break
        }

        if (figure.type === 'queen' && figure.color==='b') {
            res = checkQueenMoveGeometry(coordinatesById(figure.cellId), coordinatesById(whiteKing.cellId), whiteKing, game).attack;}
        if (figure.type === 'pawn' && figure.color==='b') {
            res = checkPawnMoveGeometry(coordinatesById(figure.cellId), coordinatesById(whiteKing.cellId), figure, whiteKing, game).attack;}
        if (figure.type === 'horse' && figure.color==='b') {
            res = checkHorseMoveGeometry(coordinatesById(figure.cellId), coordinatesById(whiteKing.cellId), whiteKing, game).attack;}
        if (figure.type === 'bishop' && figure.color==='b') {
            res = checkBishopMoveGeometry(coordinatesById(figure.cellId), coordinatesById(whiteKing.cellId), whiteKing, game).attack;}
        if (figure.type === 'rook' && figure.color==='b') {
            res = checkRookMoveGeometry(coordinatesById(figure.cellId), coordinatesById(whiteKing.cellId), whiteKing, game).attack;}
        if (figure.type === 'king' && figure.color==='b') {
            res = checkKingMoveGeometry(coordinatesById(figure.cellId), coordinatesById(whiteKing.cellId), whiteKing, game).attack;}
        if (res) {
            res_.whiteKingIsAttacked = true;
            res_.enemyForWhite = figure;
            break
        }
    }
    return res_;
}

const test = function(king, coord, game) {
    if (checkCoord(coord)) {
        let f = _.find(game.figures, o => o.cellId === id(coord));
        let r1 = checkKingMoveGeometry(coordinatesById(king.cellId), coord, f, game).move;
        let r2 = checkKingAttack(cloneGame(coordinatesById(king.cellId), coord, king, f, game));
        if (king.color === 'w') return r1 && !r2.whiteKingIsAttacked;
        if (king.color === 'b') return r1 && !r2.blackKingIsAttacked;
    }
    return false;
}
const checkStalemate1 = function(king, game) {
    let a;
    let x = coordinatesById(king.cellId).x;
    let y = coordinatesById(king.cellId).y;
    a = test(king, {x: x, y: y+1}, game); if (a) return false;
    a = test(king, {x: x, y: y-1}, game); if (a) return false;
    a = test(king, {x: x+1, y: y}, game); if (a) return false;
    a = test(king, {x: x-1, y: y}, game); if (a) return false;
    a = test(king, {x: x+1, y: y+1}, game); if (a) return false;
    a = test(king, {x: x-1, y: y+1}, game); if (a) return false;
    a = test(king, {x: x+1, y: y-1}, game); if (a) return false;
    a = test(king, {x: x-1, y: y-1}, game); if (a) return false;
    return true;
}
const checkStalemate2 = function(king, enemy, game) {
    let coordKing = coordinatesById(king.cellId);
    let coordEnemy = coordinatesById(enemy.cellId);
    let kingColor = king.color;
    let gf = game.figures;
    let res;
    let r = false;
    let c = ['rook', 'bishop', 'queen', 'pawn'];
    for (let i=0 ; i<c.length; i++) if (c[i]===enemy.type) r=true;
    if (r) {
        let dx = coordKing.x < coordEnemy.x ? 1 : coordKing.x > coordEnemy.x? -1 : 0;
        let dy = coordKing.y < coordEnemy.y ? 1 : coordKing.y > coordEnemy.y? -1 : 0;
        let x = coordKing.x;
        let y = coordKing.y;
        let r = Math.max(Math.abs(coordKing.x - coordEnemy.x), Math.abs(coordKing.y - coordEnemy.y));
        if (enemy.type === 'horse') {
            let id_ = enemy.cellId;
            let f = _.find(game.figures, o => o.cellId === id_);
            for (let j in gf) {
                let figure = gf[j];
                if (figure.type === 'queen' && figure.color === kingColor) {
                    res = ['queen', checkQueenMoveGeometry(coordinatesById(figure.cellId), coordinatesById(id_), f, game).attack];
                }
                if (figure.type === 'pawn' && figure.color === kingColor) {
                    res = ['pawn', checkPawnMoveGeometry(coordinatesById(figure.cellId), coordinatesById(id_), figure, f, game).attack];
                }
                if (figure.type === 'horse' && figure.color === kingColor) {
                    res = ['horse', checkHorseMoveGeometry(coordinatesById(figure.cellId), coordinatesById(id_), f, game).attack];
                }
                if (figure.type === 'bishop' && figure.color === kingColor) {
                    res = ['bishop', checkBishopMoveGeometry(coordinatesById(figure.cellId), coordinatesById(id_), f, game).attack];
                }
                if (figure.type === 'rook' && figure.color === kingColor) {
                    res = ['rook', checkRookMoveGeometry(coordinatesById(figure.cellId), coordinatesById(id_), f, game).attack];
                }
                if (figure.type === 'king' && figure.color === kingColor) {
                    res =['king', checkKingMoveGeometry(coordinatesById(figure.cellId), coordinatesById(id_), f, game).attack];
                }
                if (res && res[1]) {
                    let res1 = checkKingAttack(cloneGame(coordinatesById(figure.cellId), coordinatesById(id_), figure, f, game));
                    //console.log('фигура, которая может защитить:', res[0], res1.blackKingIsAttacked, res1.whiteKingIsAttacked);
                    if (kingColor==='w') {
                        if (!res1.whiteKingIsAttacked) {return false;} else {return true;}
                    }
                    else {
                        if (!res1.blackKingIsAttacked) {return false;} else {return true;}
                    }
                }
            }
        }
        else {
            for (let i=0; i<=r; i++) {
                x+=dx;
                y+=dy;
                let id_ = x*8+y;
                let f = _.find(game.figures, o => o.cellId === id_);
                let res;
                //console.log(enemy.type, kingColor, enemy.color);
                for (let j in gf) {
                    let figure = gf[j];
                    if (figure.type === 'queen' && figure.color === kingColor) {
                        res = ['queen', checkQueenMoveGeometry(coordinatesById(figure.cellId), coordinatesById(id_), f, game).attack];
                    }
                    if (figure.type === 'pawn' && figure.color === kingColor) {
                        res = ['pawn', checkPawnMoveGeometry(coordinatesById(figure.cellId), coordinatesById(id_), figure, f, game).attack];
                    }
                    if (figure.type === 'horse' && figure.color === kingColor) {
                        res = ['horse', checkHorseMoveGeometry(coordinatesById(figure.cellId), coordinatesById(id_), f, game).attack];
                    }
                    if (figure.type === 'bishop' && figure.color === kingColor) {
                        res = ['bishop', checkBishopMoveGeometry(coordinatesById(figure.cellId), coordinatesById(id_), f, game).attack];
                    }
                    if (figure.type === 'rook' && figure.color === kingColor) {
                        res = ['rook', checkRookMoveGeometry(coordinatesById(figure.cellId), coordinatesById(id_), f, game).attack];
                    }
                    if (figure.type === 'king' && figure.color === kingColor) {
                        res =['king', checkKingMoveGeometry(coordinatesById(figure.cellId), coordinatesById(id_), f, game).attack];
                    }
                    if (res && res[1]) {
                        let res1 = checkKingAttack(cloneGame(coordinatesById(figure.cellId), coordinatesById(id_), figure, f, game));
                        //console.log('фигура, которая может защитить:', res[0], res1.blackKingIsAttacked, res1.whiteKingIsAttacked);
                        if (kingColor==='w') {
                            if (!res1.whiteKingIsAttacked) {return false;} else {return true;}
                        }
                        else {
                            if (!res1.blackKingIsAttacked) {return false;} else {return true;}
                        }
                    }
                }
            }
        }

    }

    return true;
}

const checkForCastling = function(figureFrom, figureTo, game) {
    if (!(figureFrom.type === 'king' && figureTo.type === 'rook')) return {move: false, type: 1};
    if (!(!figureFrom.isChanged && !figureTo.isChanged)) return {move: false, type: 2};
    for (let i=Math.min(figureTo.cellId, figureFrom.cellId)+1; i<Math.max(figureTo.cellId, figureFrom.cellId); i++) {
        let figure = _.find(game.figures, o => o.cellId === i);
        if (figure) return {move: false, type: 3};
    }

    let gf = game.figures;
    let res;

    for (let i=Math.min(figureTo.cellId, figureFrom.cellId); i<=Math.max(figureTo.cellId, figureFrom.cellId); i++) {
        let f = _.find(game.figures, o => o.cellId === i);
        if (figureFrom.color === 'b') {
            for (let j in gf) {
                let figure = gf[j];
                if (figure.type === 'queen' && figure.color === 'w') {
                    res = checkQueenMoveGeometry(coordinatesById(figure.cellId), coordinatesById(i), f, game).attack;
                }
                if (figure.type === 'pawn' && figure.color === 'w') {
                    res = checkPawnMoveGeometry(coordinatesById(figure.cellId), coordinatesById(i), figure, f, game).attack;
                }
                if (figure.type === 'horse' && figure.color === 'w') {
                    res = checkHorseMoveGeometry(coordinatesById(figure.cellId), coordinatesById(i), f, game).attack;
                }
                if (figure.type === 'bishop' && figure.color === 'w') {
                    res = checkBishopMoveGeometry(coordinatesById(figure.cellId), coordinatesById(i), f, game).attack;
                }
                if (figure.type === 'rook' && figure.color === 'w') {
                    res = checkRookMoveGeometry(coordinatesById(figure.cellId), coordinatesById(i), f, game).attack;
                }
                if (figure.type === 'king' && figure.color === 'w') {
                    res = checkKingMoveGeometry(coordinatesById(figure.cellId), coordinatesById(i), f, game).attack;
                }
                if (res) {
                    return {move: false, type: 4};
                    break
                }
            }
        }
        else {
            for (let j in gf) {
                let figure = gf[j];
                if (figure.type === 'queen' && figure.color==='b') {
                    res = checkQueenMoveGeometry(coordinatesById(figure.cellId), coordinatesById(i), f, game).attack;}
                if (figure.type === 'pawn' && figure.color==='b') {
                    res = checkPawnMoveGeometry(coordinatesById(figure.cellId), coordinatesById(i), figure, f, game).attack;}
                if (figure.type === 'horse' && figure.color==='b') {
                    res = checkHorseMoveGeometry(coordinatesById(figure.cellId), coordinatesById(i), f, game).attack;}
                if (figure.type === 'bishop' && figure.color==='b') {
                    res = checkBishopMoveGeometry(coordinatesById(figure.cellId), coordinatesById(i), f, game).attack;}
                if (figure.type === 'rook' && figure.color==='b') {
                    res = checkRookMoveGeometry(coordinatesById(figure.cellId), coordinatesById(i), f, game).attack;}
                if (figure.type === 'king' && figure.color==='b') {
                    res = checkKingMoveGeometry(coordinatesById(figure.cellId), coordinatesById(i), f, game).attack;}
                if (res) {
                    return {move: false, type:4};
                    break
                }
            }
        }
    }
    return {move: true};
}
const castlingMove = function(from, to) {
    if (to.y == 7) {
        return {rook: id(to)-1, king: id(from)+1};
    }
    else {
        return {rook: id(to)+2, king: id(from)-3};
    }
}

const checkPawnMoveGeometry = function(from, to, figureFrom, figureTo, game) {
    let color =  figureFrom.color;
    let maxMove = (figureFrom.isChanged) ? 1 : 2;
    if (color === 'w' && (from.x-to.x)<=maxMove && (from.x-to.x)>0 && from.y===to.y) {
        return checkThePawnsObstacles(from, to, figureTo, game, 'move');
    }
    if (color === 'b' && (to.x-from.x)<=maxMove && (to.x-from.x)>0 && from.y===to.y) {
        return checkThePawnsObstacles(from, to, figureTo, game, 'move');
    }
    if (color === 'w' && (from.x-to.x)===1 && Math.abs(from.x-to.x)===1) {
        return checkThePawnsObstacles(from, to, figureTo, game, 'attack');
    }
    if (color === 'b' && (to.x-from.x)===1 && Math.abs(from.x-to.x)===1) {
        return checkThePawnsObstacles(from, to, figureTo, game, 'attack');
    }
    return {move: false, attack: false};
}
const checkKingMoveGeometry = function(from, to, figureTo, game) {
    let difX = Math.abs(from.x-to.x);
    let difY = Math.abs(from.y-to.y);
    if (difX<=1 && difY<=1 && difX+difY>=1) {
        return checkTheKingsObstacles(from, to, figureTo, game);
    }
    return {move: false, attack: false};
}
const checkBishopMoveGeometry = function(from, to, figureTo, game) {
    let difX = Math.abs(from.x-to.x);
    let difY = Math.abs(from.y-to.y);
    if (difX===difY) {
        return checkTheBishopsObstacles(from, to, figureTo, game);
    }
    return {move: false, attack: false};
}
const checkRookMoveGeometry = function(from, to, figureTo, game) {
    let difX = Math.abs(from.x-to.x);
    let difY = Math.abs(from.y-to.y);
    if ((difX===0 && difY!==0) || (difY===0 && difX!==0)) {
        return checkTheRooksObstacles(from, to, figureTo, game);
    }
    return {move: false, attack: false};
}
const checkQueenMoveGeometry = function(from, to, figureTo, game) {
    let difX = Math.abs(from.x-to.x);
    let difY = Math.abs(from.y-to.y);
    if ((difX===0 && difY!==0) || (difY===0 && difX!==0) || difX === difY ) {
        return checkTheQueensObstacles(from, to, figureTo, game);
    }
    return {move: false, attack: false};
}
const checkHorseMoveGeometry = function(from, to, figureTo, game){
    let difX = Math.abs(from.x-to.x);
    let difY = Math.abs(from.y-to.y);
    if (difX*difY===2){
        return checkTheHorsesObstacles(from, to, figureTo, game);
    }
    return {move: false, attack: false};
}

const checkTheBishopsObstacles = function(from, to, figureTo, game){
    let x = from.x;
    let y = from.y;
    let dX = from.x<to.x ? 1 : -1;
    let dY = from.y<to.y ? 1 : -1;
    let d_ = Math.abs(from.x-to.x);
    for (i = 0; i<d_-1; i++) {
        x+=dX;
        y+=dY;
        let figure = _.find(game.figures, o => o.cellId === x * 8 + y);
        if (figure) return {move: false, attack: false};
    }
    if (figureTo) {
        if (figureTo.type==='king') return {move: false, attack: true};
        else {
            if (figureTo.color === game.currentMove) return {move: false, attack: true};
            else return {move: true, attack: true};
        }
    }
    else return {move: true, attack: true};
}
const checkTheKingsObstacles = function(from, to, figureTo, game){
    let king =  _.find(game.figures, o => o.cellId === id(from));
    if (figureTo) {
        if (figureTo.type==='king') return {move: false, attack: true};
        else {
            if (figureTo.color === king.color) return {move: false, attack: true};
            else return {move: true, attack: true};
        }
    }
    else return {move: true, attack: true};
}
const checkTheRooksObstacles = function(from, to, figureTo, game) {
    const difX = Math.abs(from.x - to.x);
    const difY = Math.abs(from.y - to.y);
    let x = from.x;
    let y = from.y;
    for (let i=0; i<Math.max(difX, difY); i++){
        if (difX!==0){
            let factorX = from.x<to.x ? 1 : -1;
            for (let i=0; i < difX-1; i++) {
                x+=factorX;
                let figure = _.find(game.figures, o => o.cellId === x * 8 + y);
                if (figure) {
                    return {move: false, attack: false};
                }
            }

        }
        else {
            let factorY = from.y<to.y ? 1 : -1;
            for (let i=0; i < difY-1; i++) {
                y+=factorY;
                let figure = _.find(game.figures, o => o.cellId === x * 8 + y);
                if (figure) {
                    return {move: false, attack: false};
                }
            }
        }
        if (figureTo) {
            if (figureTo.type=='king') return {move: false, attack: true};
            else {
                if (figureTo.color == game.currentMove) return {move: false, attack: true};
                else return {move: true, attack: true};
            }
        }
        else return {move: true, attack: true};
    }
}
const checkTheQueensObstacles = function(from, to, figureTo, game) {
    let dx = Math.abs(from.x - to.x);
    let dy = Math.abs(from.y - to.y);
    if (dx===dy) {
        return checkTheBishopsObstacles(from, to, figureTo, game);
    }
    else return checkTheRooksObstacles(from, to, figureTo, game);
}
const checkThePawnsObstacles = function(from, to, figureTo, game, type) {
    if (type === 'move') {
        let dx = (from.x<to.x) ? 1 : -1;
        let x = from.x;
        let y = from.y;
        for (i=0; i<Math.abs(from.x-to.x); i++) {
            x+=dx;
            let figure = _.find(game.figures, o => o.cellId === x * 8 + y);
            if (figure) return {move: false, attack: false};
        }
        return {move: true, attack: false}
    }

    else {
        if (figureTo) {
            if (figureTo.type==='king') return {move: false, attack: true};
            else {
                if (figureTo.color === game.currentMove) return {move: false, attack: true};
                else return {move: true, attack: true};
            }
        }
        else return {move: false, attack: true};

    }

}
const checkTheHorsesObstacles = function(from, to, figureTo, game){
    if (figureTo) {
        if (figureTo.type==='king') return {move: false, attack: true};
        else {
            if (figureTo.color === game.currentMove) return {move: false, attack: true};
            else return {move: true, attack: true};
        }
    }
    else return {move: true, attack: true};
}



const checkMove = function(game, from, to) {
    const figureFrom =  _.find(game.figures, o => o.cellId === from);
    const figureTo =  _.find(game.figures, o => o.cellId === to);
    const coordinatesFrom =  coordinatesById(from);
    const coordinatesTo =  coordinatesById(to);
    let checkMove1;
    if (figureFrom.color!==game.currentMove) return {move: false};
    if (figureFrom.type === 'horse') checkMove1 = checkHorseMoveGeometry(coordinatesFrom, coordinatesTo, figureTo, game).move;
    if (figureFrom.type === 'king') {checkMove1 = checkKingMoveGeometry(coordinatesFrom, coordinatesTo, figureTo, game).move; }
    if (figureFrom.type === 'bishop') checkMove1 = checkBishopMoveGeometry(coordinatesFrom, coordinatesTo, figureTo, game).move;
    if (figureFrom.type === 'rook') checkMove1 = checkRookMoveGeometry(coordinatesFrom, coordinatesTo, figureTo, game).move;
    if (figureFrom.type === 'queen') checkMove1 = checkQueenMoveGeometry(coordinatesFrom, coordinatesTo, figureTo, game).move;
    if (figureFrom.type === 'pawn') checkMove1 = checkPawnMoveGeometry(coordinatesFrom, coordinatesTo, figureFrom, figureTo, game).move;
    let r = checkKingAttack(cloneGame(coordinatesFrom, coordinatesTo, figureFrom, figureTo, game))
    //console.log(checkMove1, r);
    let ans;
    if (game.currentMove === 'w') {
        ans =  (checkMove1 && !r.whiteKingIsAttacked);
    }
    else {
        ans =  (checkMove1 && !r.blackKingIsAttacked);
    }
    if (figureFrom.type === 'pawn' && pawnTransformation(figureFrom, coordinatesFrom, coordinatesTo, game) && ans) {
        game.pawnTransformation = true;
    }
    console.log(figureFrom.type, coordinatesFrom.x+'-'+coordinatesTo.x+' -> '+ coordinatesFrom.y+'-'+coordinatesTo.y+'   ', from+' -> '+to, ans);
    return {move: ans};


};

async function newGame(req, res) {
    const game = {
        isJoined: false,
        currentMove: 'w',
        gameId: generateGameId(),
        // gameId: 3333,
        beginTime: null,
        gameOver: false,
        attack: {whiteKingAttacked: false, blackKingAttacked: false},
        pawnTransformation: false,
        transformationId: null,
        figures: [
            {isChanged: false, type: 'pawn', color: 'w', cellId: 48},
            {isChanged: false, type: 'pawn', color: 'w', cellId: 49},
            {isChanged: false, type: 'pawn', color: 'w', cellId: 50},
            {isChanged: false, type: 'pawn', color: 'w', cellId: 51},
            {isChanged: false, type: 'pawn', color: 'w', cellId: 52},
            {isChanged: false, type: 'pawn', color: 'w', cellId: 53},
            {isChanged: false, type: 'pawn', color: 'w', cellId: 54},
            {isChanged: false, type: 'pawn', color: 'w', cellId: 55},
            {isChanged: false, type: 'pawn', color: 'b', cellId: 8},
            {isChanged: false, type: 'pawn', color: 'b', cellId: 9},
            {isChanged: false, type: 'pawn', color: 'b', cellId: 10},
            {isChanged: false, type: 'pawn', color: 'b', cellId: 11},
            {isChanged: false, type: 'pawn', color: 'b', cellId: 12},
            {isChanged: false, type: 'pawn', color: 'b', cellId: 13},
            {isChanged: false, type: 'pawn', color: 'b', cellId: 14},
            {isChanged: false, type: 'pawn', color: 'b', cellId: 15},
            {type: 'horse', color: 'b', cellId: 1},
            {type: 'horse', color: 'b', cellId: 6},
            {type: 'horse', color: 'w', cellId: 57},
            {type: 'horse', color: 'w', cellId: 62},
            {isChanged: false, type: 'rook', color: 'b', cellId: 0},
            {isChanged: false, type: 'rook', color: 'b', cellId: 7},
            {isChanged: false, type: 'rook', color: 'w', cellId: 56},
            {isChanged: false, type: 'rook', color: 'w', cellId: 63},
            {type: 'queen', color: 'b', cellId: 3},
            {type: 'queen', color: 'w', cellId: 59},
            {isChanged: false, type: 'king', color: 'b', cellId: 4},
            {isChanged: false, type: 'king', color: 'w', cellId: 60},
            {type: 'bishop', color: 'b', cellId: 2},
            {type: 'bishop', color: 'b', cellId: 5},
            {type: 'bishop', color: 'w', cellId: 58},
            {type: 'bishop', color: 'w', cellId: 61},
        ],
    };
    games.push(game);
    res.send({game: game});
}

async function joinGame(req, res) {
    let gameId = +req.body.gameId;

    const game = _.find(games, o => o.gameId === gameId);
    if (game) {
        game.isJoined = true;
        game.beginTime = Date();
        res.send({game: game});
    }
    else {
        res.send({error: 'Игра не найдена.'});
    }
}

async function move(req, res) {
    const data = req.body;
    const game = _.find(games, o => o.gameId === data.gameId);
    if (!game) {
        res.send({error :'Error'});
        return;
    }
    if (!game.isJoined) {
        res.send({error: 'Дождитесь второго игрока'});
        return;
    }
    const figureFrom = _.find(game.figures, o => o.cellId === data.move.stepFrom);
    const figureTo = _.find(game.figures, o => o.cellId === data.move.stepTo);
    const checkMoveRes = checkMove(game, data.move.stepFrom, data.move.stepTo);
    if (figureTo && figureFrom.color === figureTo.color) {
        let a = checkForCastling(figureFrom, figureTo, game);
        console.log('рокировка: ', a.move);
        if (a.move) {
            let aa = castlingMove(coordinatesById(figureFrom.cellId), coordinatesById(figureTo.cellId));
            figureTo.cellId = aa.king;
            figureFrom.cellId = aa.rook;
            figureFrom.isChanged = true;
            figureTo.isChanged = true;
            game.currentMove = game.currentMove === 'w' ? 'b' : 'w';
            res.send({game});
            return;
        }
    }
    if (checkMoveRes.move) {
        if (!figureTo || (figureTo.color!==figureFrom.color)){
            if (figureTo) {
                _.remove(game.figures, o => o === figureTo);}
            figureFrom.cellId = data.move.stepTo;
            if (figureFrom.type === 'pawn' || figureFrom.type ==='king' || figureFrom.type==='rook') {
                figureFrom.isChanged = true;
            }
            let a = checkKingAttack(game);
            game.attack = a;
            if (game.attack.whiteKingIsAttacked) {
                let king = _.find(game.figures, o => o.type=== 'king' && o.color === 'w');
                let cs1 = checkStalemate1(king, game);
                let cs2 = checkStalemate2(king, game.attack.enemyForWhite, game);
                console.log('AAA', cs1, cs2);
                game.gameOver = cs1 && cs2;
            }
            if (game.attack.blackKingIsAttacked) {
                let king = _.find(game.figures, o => o.type=== 'king' && o.color === 'b');
                let cs1 = checkStalemate1(king, game);
                let cs2 = checkStalemate2(king, game.attack.enemyForBlack, game);
                console.log('AAA', cs1, cs2);
                game.gameOver = cs1 && cs2;
            }
            console.log('GameOver:', game.gameOver);
            game.currentMove = game.currentMove === 'w' ? 'b' : 'w';
            res.send({game});
            return;
        }
    }
    res.send({game: game, error: 'Wrong move'});

}

async function transformation(req, res) {
    const data = req.body;
    const game = _.find(games, o => o.gameId === data.gameId);
    const figure = _.find(game.figures, o => o.cellId === game.transformationId);
    figure.type = data.type;
    game.pawnTransformation = false;
    console.log(checkKingAttack(game));
    res.send({game});
}
async function refreshGame(req, res) {
    let gameId = parseInt(req.body.gameId, 10);
    const game = _.find(games, o => o.gameId === gameId);
    if (game) {
        res.send({game: game});
    }
    else {
        res.send({error: 'Игра не найдена.'});
    }
}

module.exports.newGame = newGame;
module.exports.move = move;
module.exports.joinGame = joinGame;
module.exports.refreshGame = refreshGame;
module.exports.transformation = transformation;