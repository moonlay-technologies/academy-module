function test(name, path) {
    describe(name, function() {
        require(path);
    })
}


describe('#academy-module', function(done) {
    this.timeout(2 * 60000);

    // Auth
    // test('@auth/account-manager', './auth/account/crud');
    // test('@auth/account-manager', './auth/account/create');
    // test('@auth/role-manager', './auth/role-manager-test');
    test('@master/project-manager', './master/project/create');
    test('@master/project-manager', './master/project/crud');

});
