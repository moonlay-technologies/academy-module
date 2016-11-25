'use strict'

var ObjectId = require("mongodb").ObjectId;
require("mongodb-toolkit");
var BaseManager = require('module-toolkit').BaseManager;
var ValidationError = require('module-toolkit').ValidationError;
var Models = require('academy-models');
var map = Models.map;
var WeeklyTimesheet = Models.timesheet.WeeklyTimesheet;

module.exports = class WeeklyTimesheetManager extends BaseManager {
    constructor(db, user) {
        super(db, user);
        this.collection = this.db.use(map.timesheet.collection.WeeklyTimesheet);
    }

    _createIndexes() {
        var dateIndex = {
            name: `ix_${map.timesheet.collection.WeeklyTimesheet}__updatedDate`,
            key: {
                _updatedDate: -1
            }
        };

        var codeIndex = {
            name: `ix_${map.timesheet.collection.WeeklyTimesheet}_code`,
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

    _validate(weeklyTimesheet) {
        var errors = {};
        return new Promise((resolve, reject) => {
            var valid = weeklyTimesheet;
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
                    var _weeklyTimesheet = results[0];

                    if (!valid.code || valid.code == '')
                        errors["code"] = "Kode harus diisi";
                    else if (_weeklyTimesheet) {
                        errors["code"] = "Kode sudah ada";
                    }

                    if (!valid.name || valid.name == '')
                        errors["name"] = "Nama Harus diisi";


                    // 2c. begin: check if data has any error, reject if it has.
                    if (Object.getOwnPropertyNames(errors).length > 0) {
                        reject(new ValidationError('data does not pass validation', errors));
                    }

                    valid = new WeeklyTimesheet(valid);
                    valid.stamp(this.user.username, 'manager');
                    resolve(valid);
                })
                .catch(e => {
                    reject(e);
                })
        });
    }
}
