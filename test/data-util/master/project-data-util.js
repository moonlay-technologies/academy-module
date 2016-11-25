'use strict';
var _getSert = require('../getsert');

class ProjectDataUtil {
    getSert(project) {
        var ProjectManager = require('../../../src/managers/master/project-manager');
        return Promise.resolve(_getSert(project, ProjectManager, data => {
            return {
                code: data.code
            };
        }));
    }
    getTestData() {
        var testData = {
            code: 'PRJ-UT',
            name: 'Unit Test Project',
            description: 'project unit test'
        };
        return Promise.resolve(this.getSert(testData));
    }
}
module.exports = new ProjectDataUtil();
