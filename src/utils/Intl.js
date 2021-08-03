const Lang = {
    en: 0,
    zh: 1,
}

const Theme = {
    Light: 0,
    Dark: 1,
}

class ConfigError {
    constructor(msg) {
        this.msg = msg;
    }

    toString() {
        return "ConfigError: " + this.msg;
    }
}

function HeaderProvider(word, recent01, recent02, yesterday, today, option) {
    return {
        word, recent01, recent02, yesterday, today, option
    };
}

class Config {
    constructor(lang=Lang.en, theme=Theme.Light) {
        this.lang = lang;
        this.theme = theme;
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
                    // 选项 - 编辑 & 删除
                    "Options"
                );
            case Lang.zh: 
                return HeaderProvider("单词", "前", "天的记录", "昨天记录", "今天记录", "选项");
            default: 
                throw new ConfigError("Unrecognized Language");
        }
    }
}

export default {Config, Lang, Theme};