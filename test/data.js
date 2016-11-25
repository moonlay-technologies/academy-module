module.exports = {
    auth: {
        account: require('./data-util/auth/account-data-util'),
        role: require('./data-util/auth/role-data-util')
    },
    
    master: {
        project: require('./data-util/master/project-data-util')
    }
};
