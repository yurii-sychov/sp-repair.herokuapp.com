const mysql = require('mysql2/promise');
const configMysql = require('../config/database');

class own_needs_model {   
    get_data() {
        console.log('qwerty');
    }
}

const model = new own_needs_model();

module.exports = model;