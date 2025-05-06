class Author {
    constructor({ _id, key, name, country, birthday }) {
        this._id      = _id;
        this.key      = key;
        this.name     = name;
        this.country  = country;
        this.birthday = birthday;
    }
}

module.exports = Author;