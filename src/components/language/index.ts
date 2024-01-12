import localizify from "localizify";

const fa = require('./messages/fa.json');

// const localize = localizify.default.add('fa', fa).setLocale('fa');
const localize = localizify.add('fa', fa).setLocale('fa');


export default localize