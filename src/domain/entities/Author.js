class Author {
    constructor({ _id, key, normalizedName, name, country, birthday }) {
        this._id            = _id;
        this.key            = key;
        this.normalizedName = normalizedName;
        this.name           = name;
        this.country        = country;
        this.birthday       = birthday;
    }

    toJSON() {
        return {
            _id           : this._id,
            key           : this.key,
            normalizedName: this.normalizedName,
            name          : this.name,
            country       : this.country,
            birthday      : this.birthday
        };
    }
    
    toString() {
        return JSON.stringify(this.toJSON());
    }
}

module.exports = Author;