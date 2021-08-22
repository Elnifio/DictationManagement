// -------- VUE-CREATED IMPORTS AND CONFIGS --------
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
Vue.config.productionTip = false;
// -------- UTILS IMPORTS --------
import Intl from "./utils/Intl";
import Table from "./utils/Table";
// -------- END OF IMPORTS --------

let config = new Intl.Config(Intl.Lang.zh, Intl.Theme.Light);
let sheet = new Table.Table("三年级上册");
sheet.insert("01");
sheet.insert("02");
sheet.insert("03");
let i = 0;
while (i < 30) {
  sheet.insert(`${i}-word`);
  i += 1;
}
sheet.initiateRecord();
sheet.recordCorrect(sheet.words[0]);
sheet.recordCorrect(sheet.words[0]);
sheet.recordCorrect(sheet.words[0]);

new Vue({
  vuetify,
  data: {
    config, sheet
  },
  render: h => h(App, {
    props: {
      Sheet: sheet,
      Config: config
    }
  })
}).$mount('#app')
