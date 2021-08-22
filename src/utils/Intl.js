const Lang = {
    en: 0,
    zh: 1,
};

const Theme = {
    Light: 0,
    Dark: 1,
};

function ThemeIconFinder(themeName) {
    switch(themeName) {
        case "Light":
            return "mdi-weather-sunny";
        case "Dark":
            return "mdi-weather-night";
        default:
            throw new ConfigError(`Unrecognized Theme ${themeName}`);
    }
}

const Mode = {
    dictation: 0,
    edit: 1,
    viewonly: 2
};

/**
 * 
 * @param {Integer} theme 
 * @returns 
 */
function findName(theme) {
    let filtered = Object.keys(Theme).filter(x => Theme[x] == theme);
    if (filtered.length != 1) {
        throw new ConfigError(`${filtered.length} items found in finding name: ${theme}`);
    }
    return filtered[0];
}

class ConfigError {
    constructor(msg) {
        this.msg = msg;
    }

    toString() {
        return "ConfigError: " + this.msg;
    } 
}

function HeaderProvider(word, recent01, recent02, yesterday, today, last, option) {
    return {
        word, recent01, recent02, yesterday, today, last, option
    };
}

function OptionProvider(editDisabled, editEnabled, deleteDisabled, deleteEnabled) {
    return {
        edit: {enabled: editEnabled, disabled: editDisabled},
        delete: {enabled: deleteEnabled, disabled: deleteDisabled}
    }
}

function ModePromptProvider(modeprompt, dictation, edit, viewonly) {
    return {
        modeprompt, dictation, edit, viewonly
    };
}

function ModeClassProvider(modeprompt, dictation, edit, viewonly) {
    return {modeprompt,dictation,edit,viewonly};
}

function lastProvider(tprompt, fprompt, uprompt) {
    return {
        true: tprompt,
        false: fprompt,
        undefined: uprompt
    }
}

function tooltipProvider(edittip, deletetip, correcttip, wrongtip, canceltip, addtip) {
    return {
        edit: edittip,
        delete: deletetip,
        correct: correcttip,
        wrong: wrongtip,
        cancel: canceltip,
        add: addtip
    }
}

function errorMaker(alreadyContains) {
    return {
        alreadyContainWord: alreadyContains,
    };
}

function baseColorProvider() {
    return ['red', 'purple', 'blue', 'light-blue', 'green', 'light-green', 'yellow', 'orange', 'deep-orange'];
}

class Config {
    constructor(lang=Lang.en, theme=Theme.Light) {
        this.lang = lang;
        this.theme = theme;
    }

    get highlightChoices() {
        switch(this.theme) {
            case Theme.Light:
                return baseColorProvider().map(x => x + " lighten-3");
            case Theme.Dark:
                return baseColorProvider().map(x => x + " darken-3");
            default:
                throw new ConfigError("Unrecognized Theme Identifier");
        }
    }

    get header() {
        switch(this.lang) {
            case Lang.en:
                return HeaderProvider(
                    // 词语
                    "Spelling",
                    // 历史记录
                    "Recent History of Past",
                    "Days",
                    // 昨天记录
                    "Yesterday's Record", 
                    // 今天记录
                    "Today's Record",
                    "Last Dictation Record",
                    // 选项 - 编辑 & 删除
                    "Options"
                );
            case Lang.zh: 
                return HeaderProvider("单词", "前", "天的记录", "昨天记录", "今天记录", "上次听写记录", "选项");
            default: 
                throw new ConfigError("Unrecognized Language");
        }
    }

    get last() {
        switch(this.lang) {
            case Lang.en:
                return lastProvider("Correct", "Incorrect", "Not Involved");
            case Lang.zh:
                return lastProvider("正确", "错误", "没报");
            default: 
                throw new ConfigError("Unrecognized Language");
        }
    }

    get modes() {
        return Object.keys(Mode);
    }

    get rawModes() {
        return Mode;
    }

    get modePrompt() {
        switch(this.lang) {
            case Lang.en:
                return ModePromptProvider("Mode", "Dictation", "Edit", "View Only");
            case Lang.zh:
                return ModePromptProvider("模式选择", "听写", "编辑", "只读");
            default:
                throw new ConfigError(`Unrecognized Language Identifier: ${this.lang}`);
        }
    }

    get modeClass() {
        switch(this.theme) {
            case Theme.Light: 
                return ModeClassProvider("grey darken-4",
                    "green lighten-1", 
                    "blue lighten-1",
                    "red lighten-1");
            case Theme.Dark: 
                return ModeClassProvider("grey lighten-4", 
                    "green darken-1", 
                    "blue darken-1",
                    "red darken-1");
            default:
                throw new ConfigError(`Unrecognized Theme Identifier: ${this.theme}`);
        }
    }

    get tooltip() {
        switch(this.lang) {
            case Lang.en:
                return tooltipProvider("Edit Word", "Delete Word", "Mark as Correct", "Mark as Incorrect", "Cancel Mark", "Add Word");
            case Lang.zh:
                return tooltipProvider("编辑词语", "删除词语", "标为正确", "标为错误", "取消标记", "添加词语");
            default:
                throw new ConfigError("Unrecognized Language");
        }

    }

    get palette() {
        return this.themeColor(this.theme);
    }

    get backgroundColor() {
        switch(this.theme) {
            case Theme.Light:
                return "grey lighten-5";
            case Theme.Dark:
                return "grey darken-3";
            default:
                throw new ConfigError(`Unrecognized Theme Identifier: ${this.theme}`);
        }
    }

    get defaultTextColor() {
        switch(this.theme) {
            case Theme.Light:
                return {base: "grey", accent: "darken-4"};
            case Theme.Dark:
                return {base: "grey", accent: "lighten-4"};
            default:
                throw new ConfigError(`Unrecognized Theme Identifier: ${this.theme}`);
        }
    }

    get errors() {
        switch(this.lang) {
            case Lang.en:
                return errorMaker("This word already exists.");
            case Lang.zh:
                return errorMaker("记录中已存在这个单词");
            default:
                throw new ConfigError("Unrecognized Language");
        }
    }

    themeColor(theme) {
        switch(theme) {
            case Theme.Light: 
                return "yellow darken-2";
            case Theme.Dark:
                return "blue darken-2";
            default:
                throw new ConfigError(`Unrecognized Theme Identifier: ${this.theme}`);
        }
    }

    themeIcon(theme) {
        return ThemeIconFinder(theme);
    }

    get allThemes() {
        return Object.keys(Theme);
    }

    get rawThemes() {
        return Theme;
    }

    get optionClass() {
        switch(this.theme) {
            case Theme.Light:
                return OptionProvider("grey lighten-4", "green", "grey lighten-4", "red");
            case Theme.Dark:
                return OptionProvider("grey darken-3", "green lighten-3", "grey darken-3", "red lighten-3");
            default:
                throw new ConfigError(`Illegal theme identifier: ${this.theme}`);
        }
    }

    get themeName() {
        return findName(this.theme);
    }
}

export default {Config, Lang, Theme, Mode};