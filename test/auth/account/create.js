require("should");
var dataUtil = require('../../data').auth.account;
var helper = require("../../helper");

var AccountManager = require("../../../src/managers/auth/account-manager");
var accountManager = null;

before('#00. connect db', function(done) {
    helper.getDb()
        .then(db => {
            accountManager = new AccountManager(db, {
                username: 'dev'
            });
            done();
        })
        .catch(e => {
            done(e);
        });
});

it('#01. should error when create with empty data ', function(done) {
    accountManager.create({})
        .then(id => {
            done("should error when create with empty data");
        })
        .catch(e => {
            try {
                // e.errors.should.have.property('code');
                // e.errors.should.have.property('name');
                done();
            }
            catch (ex) {
                done(ex);
            }
        });
});
 
it('#02. should success when get test data', function(done) {
    dataUtil.getTestData()
        .then(account => {
            account.should.not.equal(null);
            done();
        })
        .catch(e => {
            done(e);
        });
});
