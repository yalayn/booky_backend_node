class Editorial {
    constructor({ _id, key, normalizedName, name, country, founding_date }) {
        this._id            = _id;
        this.key            = key;
        this.normalizedName = normalizedName;
        this.name           = name;
        this.country        = country;
        this.founding_date  = founding_date;
    }
}

module.exports = Editorial;