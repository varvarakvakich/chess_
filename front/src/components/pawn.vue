<template>
    <div class="modal-shadow">
        <div class="modal-window" :style="calcStyleWindow">
            <slot>
            </slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pawn",
        props: ['width', 'height'],
        computed: {
            calcStyleWindow() {
                return {
                    width: this.width,
                    height: this.height,
                };
            },
        },
    }
</script>

<style scoped>
    .modal-shadow {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(255, 255, 255, .6);
        z-index: 1000;
    }
    .modal-window {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: black;
        background: white;
        -webkit-box-shadow: 4px 4px 16px 0px rgba(50, 50, 50, 0.6);
        -moz-box-shadow:    4px 4px 16px 0px rgba(50, 50, 50, 0.6);
        box-shadow:         4px 4px 16px 0px rgba(50, 50, 50, 0.6);

    }
</style>