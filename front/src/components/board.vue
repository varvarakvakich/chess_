<template>
    <div class="board">

        <div :class="calcClass" class="board-123">
            <div class="board-123-angle"></div>
            <div :key="index" v-for="(row, index) in [8, 7, 6, 5, 4, 3, 2, 1]">
                <div class="board-123-cell">{{row}}</div>
            </div>
            <div class="board-123-angle"></div>
        </div>

        <div :class="calcClass" class="board-body">
            <div class="board-abc">
                <div :key="index" v-for="(row, index) in ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']">
                    <div class="board-abc-cell">{{row}}</div>
                </div>
            </div>

            <div :key="index" class="board-row" v-for="(row, index) in cells">
                <BoardCell :figureColor="getFigureColor(cell.id)"
                           :figureType="getFigureType(cell.id)"
                           :id="cell.id" :is-black="cell.isBlack" :is-checked="cell.id === stepFrom || cell.id === stepTo"
                           :key="cell.id"
                           @cellClick="onCellClick"
                           v-for="cell in row"

                />
            </div>

            <div class="board-abc">
                <div :key="index" v-for="(row, index) in ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']">
                    <div class="board-abc-cell">{{row}}</div>
                </div>
            </div>
        </div>

        <div class="board-123" :class="calcClass">
            <div class="board-123-angle"></div>
            <div :key="index" v-for="(row, index) in [8, 7, 6, 5, 4, 3, 2, 1]">
                <div class="board-123-cell">{{row}}</div>
            </div>
            <div class="board-123-angle"></div>
        </div>


    </div>
</template>

<script>

    import _ from 'lodash';
    import BoardCell from "./board-cell";

    export default {
        components: {BoardCell},
        name: "Board",
        props: ['myColor', 'currentMoveColor'],
        created() {
            let cells = [];
            let isBlack = false;
            for (let i = 0; i < 8; i++) {
                let row = [];
                for (let j = 0; j < 8; j++) {
                    row.push({
                        id: i * 8 + j,
                        isBlack: isBlack,
                    });
                    isBlack = !isBlack;

                }
                isBlack = !isBlack;
                cells.push(row);
            }

            this.cells = cells;
        },
        data() {
            return {
                cells: null,
                figures: [],
                stepFrom: null,
                stepTo: null,
                stepStatus: 0,
            }
        },
        methods: {
            getFigureType(id) {
                let figure = _.find(this.figures, o => o.cellId === id);
                return figure ? figure.type : null;
            },
            getFigureColor(id) {
                let figure = _.find(this.figures, o => o.cellId === id);
                return figure ? figure.color : null;
            },
            getCellById(id) {
                return this.cells[Math.floor(id / 8)][id % 8];
            },
            getFigureById(id) {
                return _.find(this.figures, o => o.cellId === id);
            },
            onCellClick(id) {
                const figure = this.getFigureById(id);
                if (this.stepStatus === 0) {
                    // eslint-disable-next-line no-console
                    if (figure && figure.color === this.currentMoveColor) {
                        // eslint-disable-next-line no-console
                        this.stepFrom = id;
                        this.stepStatus++;
                    }
                } else if (this.stepStatus === 1) {
                    if (id === this.stepFrom) {
                        this.clearStatus();
                        return;
                    }

                    this.stepTo = id;
                    this.stepStatus++;
                    this.$emit('move', {stepFrom: this.stepFrom, stepTo: this.stepTo});
                    this.clearStatus();
                }
            },
            setFigures(figures) {
                this.figures = figures;
            },
            clearStatus() {
                this.stepStatus = 0;
                this.stepFrom = null;
                this.stepTo = null;
            }
        },
        computed: {
            calcClass() {
                return {
                    'board-reverse': this.myColor === 'b',
                }
            },
        },
    }

</script>