'use strict';
var _getSert = require('../getsert');
var role = require('./role-data-util');

class AccountDataUtil {
    getSert(account) {
        var AccountManager = require('../../../src/managers/auth/account-manager');
        return Promise.resolve(_getSert(account, AccountManager, data => {
            return {
                username: data.username
            };
        }));
    }

    getTestData() {
        return new Promise((resolve, reject) => {
            role.getTestData()
                .then(role => {
                    var testData = {
                        username: 'test',
                        password: 'Standar123',
                        profile: {
                            firstname: 'unit',
                            lastname: 'test',
                            dob: new Date(),
                            gender: 'M',
                            email: 'test.data@unit.test'
                        },
                        roles: [role]
                    };

                    this.getSert(testData)
                        .then(data => {
                            resolve(data);
                        })
                        .catch(e => {
                            reject(e);
                        });
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
}

module.exports = new AccountDataUtil();
