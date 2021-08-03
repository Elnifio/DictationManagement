<template>
    <v-data-table
        :headers="headers"
        :items="content">
        <template v-slot:header.history="{ header }">
            {{ header.text.split("-")[0] }} <span @click.prevent.stop="log(history)" class="mx-2">{{ history }}</span> {{ header.text.split("-")[1] }}
        </template>

        <template v-slot:item.option="{ item }">
            Edit:{{item.option.edit}};Delete:{{item.option.delete}};
        </template>
    </v-data-table>
</template>

<script>

// TODO: Data Model Complete, create view for the data and test data model
import Table from "../utils/Table.js";
import Intl from "../utils/Intl.js";

export default {
    name: "Table",
    props: {
        table: Table.Table,
        config: Intl.Config,
    },
    data: function() {
        return {
            history: this.table.showLast,
        }
    },
    created: function() {
        console.log(this.content);
    },
    computed: {
        headers: function() {
            return [
                {text: this.config.header.word, value: "spelling"},
                {text: this.config.header.recent01 + "-" + this.config.header.recent02, value: "history"},
                {text: this.config.header.yesterday, value: "yesterday"},
                {text: this.config.header.today, value:"today"},
                {text: this.config.header.option, value:"option"}];
        },
        content: function() {
            console.log(this.table.records);
            return this.table.records.map(
                x => ({ spelling: x.self.spelling, 
                        history: `${x.history.wrong}/${x.history.correct + x.history.wrong}`, 
                        yesterday: `${x.yesterday.wrong}/${x.yesterday.correct + x.yesterday.wrong}`,
                        today: `${x.today.wrong}/${x.today.wrong + x.today.correct}`,
                        option: {delete: true, edit: true}})
            );
        }
    },
    methods: {
        changeHistory: function() {

        },
        log: function(e) { console.log(e); }
    }
}
</script>