<template>
    <div class="board-wrapper">

        <div class='game-info'>id: {{gameId}}</div>
        <div class='game-info'>time: {{timeOfGame}}</div>
        <div class='game-info'>{{currrentMoveName}}</div>
        <p class='game-info' v-if="!youAreAttacked && gameOver">Mate!</p>
        <p class='game-info' v-if="youAreAttacked && !gameOver">Check!</p>
        <p class='game-info' v-if="youAreAttacked && gameOver">Конец игры!</p>
        <Board ref="board" :my-color="myColor" :current-move-color="currentMoveColor" @move="onMove"/>
        <br/>

        <ModalWindow v-if="message">
            <p>{{message}}</p>
            <button @click = "onMessageClose">OK</button>
        </ModalWindow>
        <ModalWindow v-if="pawnTransformationVisible">
            <p>Выберите фигуру</p>
            <div style="display: flex; background: gray;">
                <BoardCell :figureColor="myColor"
                           figureType="queen"
                           :is-black="false"
                           :is-checked="false"
                           @cellClick="onSelectQueen"
                />
                <BoardCell :figureColor="myColor"
                           figureType="rook"
                           :is-black="false"
                           :is-checked="false"
                           @cellClick="onSelectRook"
                />
                <BoardCell :figureColor="myColor"
                           figureType="bishop"
                           :is-black="false"
                           :is-checked="false"
                           @cellClick="onSelectBishop"
                />
                <BoardCell :figureColor="myColor"
                           figureType="horse"
                           :is-black="false"
                           :is-checked="false"
                           @cellClick="onSelectHorse"
                />
            </div>
        </ModalWindow>
    </div>
</template>

<script>

    import moment from 'moment';
    import tools from './tools';
    import Board from './components/board';
    import ModalWindow from "./components/modal-window";
    import BoardCell from './components/board-cell'

    export default {
        components: {
            Board,
            BoardCell,
            ModalWindow,
        },
        mounted() {
            const chessGame = JSON.parse(localStorage.getItem('chessGame'));
            this.gameId = chessGame.gameId;
            this.myColor = chessGame.myColor;
            this.startRefreshGameTimer();
        },
        beforeDestroy() {
            clearInterval(this.refreshTimer);
        },
        data() {return {
            refreshTimer: null,
            gameId: null,
            beginTime: null,
            currentMove: null,
            myColor: 'w',
            currentMoveColor: null,
            modalWindowVisible: false,
            message: null,
            blackKingIsAttacked: false,
            whiteKingIsAttacked: false,
            gameOver: false,
            pawnTransformationVisible: false,
            newPawn: null,
            timeOfGame: null,
            isJoined: false,
        }},
        methods: {
            startRefreshGameTimer() {
                this.refreshTimer = setInterval(this.refreshGame.bind(this), 500);
            },
            stopRefreshGameTimer() {
                if (this.refreshTimer) {
                    clearInterval(this.refreshTimer);
                }
            },
            async joinGame() {
                try {
                    this.gameId = this.$chess.gameId;
                    const res = await tools.api.post('/joinGame', {gameId: this.gameId});
                    this.myColor = 'b';
                    this.prepareGameData(res.data.game);
                }
                catch(err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                }
            },
            async newGame() {
                // eslint-disable-next-line no-console
                console.log(this.$chess.isNewGame);
                try {
                    const res = await tools.api.post('/newGame');

                    // // eslint-disable-next-line no-console
                    // console.log(res);

                    this.prepareGameData(res.data.game);
                    this.$chess.gameId = this.gameId;
                }
                catch(err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                }

            },
            async refreshGame() {

                if (this.beginTime) {
                    let t1 = moment();
                    let t2 = moment(this.beginTime);
                    let dif = moment(t1.diff(t2)).utc(false);
                    this.timeOfGame = `${dif.format('HH:mm:ss')}`;
                }
                else {
                    this.timeOfGame = '00:00:00';
                }

                try {
                    const res = await tools.api.post('/refreshGame', {gameId: this.gameId});
                    const error = res.data.error;
                    if (error) {
                        this.message = error;
                    }
                    else {
                        this.prepareGameData(res.data.game);
                    }
                }
                catch(err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                }
            },
            onMove: async function (move) {
                try {
                    const res = await tools.api.post('/move', {gameId: this.gameId, move: move});
                    const error = res.data.error;
                    if (error) {
                        this.message = error;
                    }

                    this.prepareGameData(res.data.game);
                    this.$refs.board.clearStatus();

                    if (res.data.game.pawnTransformation) {
                        this.pawnTransformationVisible = true;
                    }
                    else {
                        this.move();
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                }
            },
            async onSelectQueen() {
                try {
                    const res = await tools.api.post('/transformation', {gameId: this.gameId, type: 'queen'});
                    this.pawnTransformationVisible = false;
                    this.prepareGameData(res.data.game);
                    this.$refs.board.clearStatus();
                    const error = res.data.error;

                    if (error) {
                        this.message = error;
                    }
                    else {
                        this.move();
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                }
            },
            async onSelectRook() {
                try {
                    const res = await tools.api.post('/transformation', {gameId: this.gameId, type: 'rook'});
                    this.pawnTransformationVisible = false;
                    this.prepareGameData(res.data.game);
                    this.$refs.board.clearStatus();
                    const error = res.data.error;
                    if (error) {
                        this.message = error;
                    }
                    else {
                        this.move();
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                }
            },
            async onSelectBishop() {
                // eslint-disable-next-line no-console
                console.error('onSelectQueen');
                try {
                    const res = await tools.api.post('/transformation', {gameId: this.gameId, type: 'bishop'});
                    this.pawnTransformationVisible = false;
                    this.prepareGameData(res.data.game);
                    this.$refs.board.clearStatus();
                    const error = res.data.error;

                    if (error) {
                        this.message = error;
                    }
                    else {
                        this.move();
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                }
            },
            async onSelectHorse() {
                // eslint-disable-next-line no-console
                console.error('onSelectQueen');
                try {
                    const res = await tools.api.post('/transformation', {gameId: this.gameId, type: 'horse'});
                    this.pawnTransformationVisible = false;
                    this.prepareGameData(res.data.game);
                    this.$refs.board.clearStatus();
                    const error = res.data.error;

                    if (error) {
                        this.message = error;
                    }
                    else {
                        this.move();
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                }
            },
            async move() {
                if (this.myColor === 'w' && this.whiteKingIsAttacked || this.myColor === 'b' && this.blackKingIsAttacked) {
                    this.message = 'Wrong move';
                }
            },
            prepareGameData: function (game) {
                this.beginTime = game.beginTime;
                this.gameId = game.gameId;
                this.help = game.help;
                this.currentMoveColor = game.currentMove;
                this.currentMove = game.currentMove;
                this.$refs.board.setFigures(game.figures);
                this.blackKingIsAttacked = game.attack.blackKingIsAttacked;
                this.whiteKingIsAttacked = game.attack.whiteKingIsAttacked;
                this.gameOver = game.gameOver;
                this.isJoined = game.isJoined;
            },
            onMessageClose() {
                this.message = null;
            },

        },
        computed: {
            currrentMoveName() {

                if (this.isJoined) {
                    return 'move: ' + (this.currentMove === 'w' ? 'white' : 'black');
                }

                return 'waiting player...';
            },
            youAreAttacked() {
                return (this.myColor === 'b' && this.blackKingIsAttacked) || (this.myColor === 'w' && this.whiteKingIsAttacked);
            },
        },
        watch: {
            message() {
                if (this.message) {
                    this.stopRefreshGameTimer();
                }
                else {
                    this.startRefreshGameTimer();
                }
            },
        }
    }
</script>

<style>

</style>
