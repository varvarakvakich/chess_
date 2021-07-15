<template>
    <div class="board-cell"  :class="calcClass" @click="onClick" >
        <img src="../media/figures/wR.png" v-if="figureType==='rook' && figureColor==='w'" :width="figureSize">
        <img src="../media/figures/bR.png" v-if="figureType==='rook' && figureColor==='b'" :width="figureSize">
        <img src="../media/figures/wP.png" v-if="figureType==='pawn' && figureColor==='w'" :width="figureSize">
        <img src="../media/figures/bP.png" v-if="figureType==='pawn' && figureColor==='b'" :width="figureSize">
        <img src="../media/figures/wN.png" v-if="figureType==='horse' && figureColor==='w'" :width="figureSize">
        <img src="../media/figures/bN.png" v-if="figureType==='horse' && figureColor==='b'" :width="figureSize">
        <img src="../media/figures/wQ.png" v-if="figureType==='queen' && figureColor==='w'" :width="figureSize">
        <img src="../media/figures/bQ.png" v-if="figureType==='queen' && figureColor==='b'" :width="figureSize">
        <img src="../media/figures/wK.png" v-if="figureType==='king' && figureColor==='w'" :width="figureSize">
        <img src="../media/figures/bK.png" v-if="figureType==='king' && figureColor==='b'" :width="figureSize">
        <img src="../media/figures/wB.png" v-if="figureType==='bishop' && figureColor==='w'" :width="figureSize">
        <img src="../media/figures/bB.png" v-if="figureType==='bishop' && figureColor==='b'" :width="figureSize">
    </div>
</template>

<script>
    export default {
        props:['isBlack', 'id', 'figureType', 'figureColor', 'isChecked'],
        data() {return {
            figureSize: '50px',
        }},
        methods:{
            onClick(){
                this.$emit('cellClick', this.id);
            }

        },
        computed: {
            calcClass(){
                return {
                    isBlack: this.isBlack,
                    isWhite: !this.isBlack,
                    isChecked: this.isChecked,
                }
            },
        },
    }

</script>