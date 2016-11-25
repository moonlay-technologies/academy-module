module.exports = {
    managers: {
        auth: {
            AccountManager: require("./src/managers/auth/account-manager"),
            RoleManager: require("./src/managers/auth/role-manager")
        }
    }
}
