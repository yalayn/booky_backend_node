class Author {
    constructor({ _id, name, country, birthday }) {
        this._id       = _id;
        this.name     = name;
        this.country  = country;
        this.birthday = birthday;
    }
}

module.exports = Author;