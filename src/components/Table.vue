<template>
    <v-data-table
        :headers="headers"
        :items="content"
        :class="config.backgroundColor"
        class="ma-2"
        hide-default-header>

        <template v-slot:top>
            <div class="my-2 d-flex">
                <span 
                    class="mx-2 my-auto" 
                    :class="config.defaultTextColor.base + '--text text--' + config.defaultTextColor.accent">
                    {{ config.modePrompt.modeprompt }}
                </span>
                <v-divider vertical class="mx-2"></v-divider>
                <div class="mr-auto">
                    <v-btn rounded
                        v-for="mode in config.modes" 
                        :color="config.modeClass[mode]" 
                        :key="mode" 
                        :text="table.mode!=config.rawModes[mode]"
                        class="mx-1 my-auto"
                        @click.prevent.stop="table.mode = config.rawModes[mode]">
                            {{ config.modePrompt[mode] }}
                    </v-btn>
                </div>
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon 
                            :color="config.palette"
                            v-bind="attrs"
                            v-on="on">
                                <v-icon>{{config.themeIcon(config.themeName)}}</v-icon>
                        </v-btn>
                    </template>

                    <v-card max-width="300px" class="d-flex">
                        <v-sheet class="ma-2">
                            <v-icon 
                                v-for="icon in config.allThemes" 
                                :key="icon"
                                class="mx-1"
                                :color="config.themeColor(config.rawThemes[icon])"
                                @click="config.theme = config.rawThemes[icon]">
                                {{ config.themeIcon(icon) }}
                            </v-icon>
                        </v-sheet>
                    </v-card>
                </v-menu>
            </div>
        </template>

        <template v-slot:header="{props: { headers }}">
            <thead>
                <tr>
                    <th v-for="header in headers" :key="header.value">
                        <span 
                            v-if="header.value == 'history'"
                            :class="config.defaultTextColor.base + '--text text--' + config.defaultTextColor.accent">
                            {{ header.text.split("-")[0] }} 
                            <span @click.prevent.stop="log(history)" class="mx-2" :class="config.defaultTextColor.base + '--text text--' + config.defaultTextColor.accent">{{ history }}</span> 
                            {{ header.text.split("-")[1] }}
                        </span>

                        <span v-else 
                            :class="config.defaultTextColor.base + '--text text--' + config.defaultTextColor.accent">
                            {{header.text}}
                        </span>
                    </th>
                </tr>
            </thead>
        </template>

        <template v-slot:item="{item}">
            <tr>
                <td v-for="key in findkey(item)" :key="key">
                    <template v-if="key=='option'">
                        <span v-if="table.mode==config.rawModes.edit">

                            <v-menu close-on-click>
                                <template v-slot:activator="{on: menu, attrs}">

                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on: tooltip }">
                                            <v-btn 
                                                fab elevation="0" x-small class="mx-1"
                                                @click.prevent.stop="log(item.self.zip())"
                                                v-bind="attrs"
                                                v-on="{ ...tooltip, ...menu }">
                                                <v-icon 
                                                    :color="item.option.edit?config.optionClass.edit.enabled:config.optionClass.edit.disabled">
                                                    mdi-pencil
                                                </v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ config.tooltip.edit }}</span>
                                    </v-tooltip>
                                </template>

                                <color-picker :presets="config.highlightChoices" @chosen="log($event)"></color-picker>
                            </v-menu>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn 
                                        fab elevation="0" x-small class="mx-1"
                                        @click.prevent.stop="deleteWord(item.self)"
                                        v-bind="attrs"
                                        v-on="on">
                                        <v-icon 
                                            :color="item.option.delete?config.optionClass.delete.enabled:config.optionClass.delete.disabled">
                                            mdi-trash-can-outline
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ config.tooltip.delete }}</span>
                            </v-tooltip>

                        </span>

                        <span v-else-if="table.mode==config.rawModes.dictation">
                            
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn 
                                        @click.prevent.stop="record(item.self, true)"
                                        v-bind="attrs"
                                        v-on="on"
                                        :color="getColor(item, true).bg"
                                        fab x-small elevation="0" class="mx-1">
                                        <v-icon 
                                            :color="getColor(item, true).color">
                                            mdi-check
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ config.tooltip.correct }}</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn 
                                        @click.prevent.stop="record(item.self, false)"
                                        v-bind="attrs"
                                        v-on="on"
                                        :color="getColor(item, false).bg"
                                        fab x-small elevation="0" class="mx-1">
                                        <v-icon 
                                            :color="getColor(item, false).color">
                                            mdi-close
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ config.tooltip.wrong }}</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn 
                                        fab x-small elevation="0" class="mx-1"
                                        @click.prevent.stop="deleteRecord(item.self)"
                                        v-bind="attrs"
                                        v-on="on">
                                        <v-icon
                                            color="blue">
                                            mdi-pencil-off-outline
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ config.tooltip.cancel }}</span>
                            </v-tooltip>
                        </span>
                    </template>
                    <span v-else :class="config.defaultTextColor.base + '--text text--' + config.defaultTextColor.accent">
                        {{ item[key] }}
                    </span>
                </td>
            </tr>
        </template>

        <template v-slot:footer.prepend>
            <v-text-field
                v-model="addedWord"
                @keydown.enter.prevent.stop="addWord()"
                :error-messages="errorMsgAdd"
                :label="config.tooltip.add"
                :disabled="table.mode!=config.rawModes.edit">
                <template v-slot:append>
                    <v-btn icon @click.prevent.stop="addWord()">
                        <v-icon color="blue">
                            mdi-plus
                        </v-icon>
                    </v-btn>
                </template>
            </v-text-field>
        </template>
    </v-data-table>
</template>


<script>
import Table from "../utils/Table.js";
import Intl from "../utils/Intl.js";
import CP from "./ColorPicker.vue";

export default {
    components: {
        ColorPicker: CP
    },
    name: "Table",
    props: {
        table: Table.Table,
        config: Intl.Config,
    },
    data: function() {
        return {
            history: this.table.showLast,
            addedWord: "",
            errorMsgAdd: "",
        }
    },
    created: function() {
        console.log(this.content);
    },
    computed: {
        headers: function() {
            let base = [
                {text: this.config.header.word, value: "spelling"},
                // TODO: 针对昨天记录、今天记录、历史记录增加排序功能
                {text: this.config.header.recent01 + "-" + this.config.header.recent02, value: "history"},
                {text: this.config.header.yesterday, value: "yesterday"},
                {text: this.config.header.today, value:"today"},
                {text: this.config.header.last, value: "last"}
            ];

            if (this.table.mode != this.config.rawModes.viewonly) {
                // TODO: 完善整个Options的功能
                base.push({text: this.config.header.option, value:"option"});
            }
            return base;
        },
        content: function() {
            return this.table.statistics.map(
                x => {
                    let base = { spelling: x.self.spelling, 
                        history: `${x.history.wrong}/${x.history.correct + x.history.wrong}`, 
                        yesterday: `${x.yesterday.wrong}/${x.yesterday.correct + x.yesterday.wrong}`,
                        today: `${x.today.wrong}/${x.today.wrong + x.today.correct}`,
                        last: this.config.last["" + x.lastRecord],
                        self: x.self,
                    };
                        
                    if (this.table.mode != this.config.rawModes.viewonly) {
                        base.option = {delete: true, edit: true};
                    }
                    return base;
                }
            );
        }
    },
    watch: {
        addedWord: function() {
            this.errorMsgAdd = "";
        },
        "table.mode": function(newval, oldval) {
            if (oldval == Intl.Mode.dictation) {
                this.table.performHighlight(this.config.highlightChoices.filter(x => x.includes("blue"))[0]);
                return;
            }
            
            if (newval == Intl.Mode.dictation) {
                this.table.initiateRecord();
                return;
            }

        }
    },
    methods: {
        changeHistory: function() {},
        log: function(e) { console.log(e); },
        findkey: function(x) { return Object.keys(x).filter(x => x != 'self'); },

        getColor(item, check) {
            if (check) {
                if (this.table.queryRecord(item.self) === true) {
                    return {
                        color: "",
                        bg: item.option.edit?this.config.optionClass.edit.enabled:this.config.optionClass.edit.disabled,
                    }
                } else {
                    return {
                        bg: "",
                        color: item.option.edit?this.config.optionClass.edit.enabled:this.config.optionClass.edit.disabled,
                    }
                }
            } else {
                if (this.table.queryRecord(item.self) === false) {
                    return {
                        color: "",
                        bg: (item.option.delete?this.config.optionClass.delete.enabled:this.config.optionClass.delete.disabled)
                    }
                } else {
                    return {
                        bg: "",
                        color: (item.option.delete?this.config.optionClass.delete.enabled:this.config.optionClass.delete.disabled)
                    }
                }
            }
        },

        addWord: function() {
            if (this.table.contains(this.addedWord)) {
                this.errorMsgAdd = this.config.errors.alreadyContainWord;
            } else {
                this.errorMsgAdd = "";
                this.table.insert(this.addedWord);
                this.addedWord = "";
            }
        },
        deleteWord: function(unit) {
            this.table.delete(unit);
        },
        record: function(unit, value) {
            console.log(this.table.queryRecord(unit));
            if (value) {
                this.table.recordCorrect(unit);
            } else {
                this.table.recordWrong(unit);
            }
            console.log(this.table.queryRecord(unit));
        },
        deleteRecord: function(unit) {
            console.log(this.table.queryRecord(unit));
            this.table.deleteRecord(unit);
            console.log(this.table.queryRecord(unit));
        }
    }
}
</script>

<style lang="scss">  
    tbody {
        tr:hover {
            background-color: rgba(128,128,128,0.3) !important;
        }
    }
</style>