<template>
    <v-sheet>
        <v-row v-for="n in nrow" :key="n">
            <v-col v-for="c in ncol" :key="c">
                <v-btn icon @click="$emit('chosen', get(n,c))">
                    <v-icon :color="get(n, c)">
                        mdi-circle-slice-8
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script>

export default {
    name: "ColorPicker",
    props: ["presets"],
    data: function() {
        return {
            nrow: 2
        }
    },
    computed: {
        ncol: function() {
            return this.presets.length % this.nrow == 1? (this.presets.length + 1) / 2 : this.presets.length / 2;
        }
    },
    methods: {
        get(row, col) {
            console.log(`Getting item from row: ${row}, col: ${col}, pos: ${row * this.ncol + col}`);
            console.log(this.presets);
            return this.presets[(row-1) * this.ncol + col-1];
        }
    }
}
</script>
