'use strict'

var ObjectId = require("mongodb").ObjectId;
require("mongodb-toolkit");
var BaseManager = require('module-toolkit').BaseManager;
var ValidationError = require('module-toolkit').ValidationError;
var Models = require('academy-models');
var map = Models.map;
var Project = Models.master.Project;

module.exports = class ProjectManager extends BaseManager {
    constructor(db, user) {
        super(db, user);
        this.collection = this.db.use(map.master.collection.Project);
    }

    _createIndexes() {
        var dateIndex = {
            name: `ix_${map.master.collection.Project}__updatedDate`,
            key: {
                _updatedDate: -1
            }
        };

        var codeIndex = {
            name: `ix_${map.master.collection.Project}_code`,
            key: {
                code: 1
            },
            unique: true
        };

        return this.collection.createIndexes([dateIndex, codeIndex]);
    }

    _getQuery(_paging) {
        var basicFilter = {
                _deleted: false
            },
            keywordFilter = {};

        var query = {};

        if (_paging.keyword) {
            var regex = new RegExp(_paging.keyword, "i");
            var filterCode = {
                'code': {
                    '$regex': regex
                }
            };
            var filterName = {
                'name': {
                    '$regex': regex
                }
            };
            keywordFilter = {
                '$or': [filterCode, filterName]
            };

        }
        query = {
            '$and': [basicFilter, _paging.filter || {}, keywordFilter]
        };
        return query;
    }

    _validate(project) {
        var errors = {};
        return new Promise((resolve, reject) => {
            var valid = project;
            // 1. begin: Declare promises.
            var getBuyerPromise = this.collection.singleOrDefault({
                "$and": [{
                    _id: {
                        '$ne': new ObjectId(valid._id)
                    }
                }, {
                    code: valid.code
                }]
            });
            // 2. begin: Validation.
            Promise.all([getBuyerPromise])
                .then(results => {
                    var _project = results[0];

                    if (!valid.code || valid.code == '')
                        errors["code"] = "Kode harus diisi";
                    else if (_project) {
                        errors["code"] = "Kode sudah ada";
                    }

                    if (!valid.name || valid.name == '')
                        errors["name"] = "Nama Harus diisi";


                    // 2c. begin: check if data has any error, reject if it has.
                    if (Object.getOwnPropertyNames(errors).length > 0) {
                        reject(new ValidationError('data does not pass validation', errors));
                    }

                    valid = new Project(valid);
                    valid.stamp(this.user.username, 'manager');
                    resolve(valid);
                })
                .catch(e => {
                    reject(e);
                })
        });
    }
}
