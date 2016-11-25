'use strict';
var _getSert = require('../getsert');

class RoleDataUtil {
    getSert(role) {
        var RoleManager = require('../../../src/managers/auth/role-manager');
        return Promise.resolve(_getSert(role, RoleManager, data => {
            return {
                code: data.code
            };
        }));
    }
    getTestData() {
        var testData = {
            code: 'ut-sa',
            name: 'Unit Test',
            description: 'Unit test super admin'
        };
        return Promise.resolve(this.getSert(testData));
    }
}
module.exports = new RoleDataUtil();
