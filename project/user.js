class Client {
    constructor(name, color) {
        this.name = name
        this.color = color
    }

    static generateDefaultUser() {
        return new Client("DefaultUser", "#FFF")
    }

}

module.exports = {
    Client
};