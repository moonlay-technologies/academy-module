require("should");
var dataUtil = require('../../data').master.project;
var helper = require("../../helper");

var ProjectManager = require("../../../src/managers/master/project-manager");
var projectManager = null;

before('#00. connect db', function(done) {
    helper.getDb()
        .then(db => {
            projectManager = new ProjectManager(db, {
                username: 'dev'
            });
            done();
        })
        .catch(e => {
            done(e);
        });
});

it('#01. should error when create with empty data ', function(done) {
    projectManager.create({})
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
        .then(project => {
            project.should.not.equal(null);
            done();
        })
        .catch(e => {
            done(e);
        });
});
