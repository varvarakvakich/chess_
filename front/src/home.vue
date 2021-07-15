<template>
    <div class="home">

        <ModalWindow v-if="message">
            <p>{{message}}</p>
            <button @click = "onMessageClose">OK</button>
        </ModalWindow>

        <ModalWindow v-if="inputJoinCodeVisible">
            <div style="width: 16em; display: flex; flex-direction: column; justify-content: center">
                <div class="header">
                    ID:
                </div>
                <input ref="input" v-model="gameId"/>
                <div style="display: flex; justify-content: center">
                    <button @click = "onMessageOk">OK</button>
                    <button @click = "onJoinMessageClose">Отмена</button>
                </div>
            </div>
        </ModalWindow>

        <button @click="onNewGame">Новая игра</button>
        <button @click="onJoinGame">Присоединиться к игре</button>

    </div>
</template>

<script>

    import ModalWindow from './components/modal-window'
    import tools from "./tools";

    export default {
        components: {
            ModalWindow,
        },
        data() {return {
            inputJoinCodeVisible: false,
            gameId: null,
            message: null,
        }},
        methods: {
            onMessageClose() {
                this.message = false;
            },
            onJoinMessageClose() {
                this.inputJoinCodeVisible = false;
            },
            async onJoinGame() {
                this.inputJoinCodeVisible = true;
                this.$nextTick(() => {
                    this.$refs.input.focus();
                });
            },
            async onNewGame() {
                try {
                    const res = await tools.api.post('/newGame');
                    const error = res.data.error;
                    if (error) {
                        this.message = error;
                    }
                    else {
                        const game = res.data.game;
                        const gameId = game.gameId;
                        const myColor = 'w';
                        localStorage.setItem('chessGame', JSON.stringify({gameId: gameId, myColor: myColor}));
                        await this.$router.push('/game');
                    }
                }
                catch(err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                }
            },
            async onMessageOk() {
                this.inputJoinCodeVisible = false;
                try {
                    const res = await tools.api.post('/joinGame', {gameId: this.gameId});
                    const error = res.data.error;
                    if (error) {
                        this.message = error;
                    }
                    else {
                        const myColor = 'b';
                        localStorage.setItem('chessGame', JSON.stringify({gameId: this.gameId, myColor: myColor}));
                        await this.$router.push('/game');
                    }
                }
                catch(err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                }
            },

        }
    }
</script>

