class BookDataSearch {
    constructor({
        key,
        title, 
        genre, 
        publication_year, 
        isbn, 
        descriptions_short, 
        descriptions_long, 
        cover_i, 
        cover_url,
        editorial, 
        author
    }) {
        this.key                = key;
        this.title              = title;
        this.genre              = genre;
        this.publication_year   = publication_year;
        this.isbn               = isbn;
        this.descriptions_short = descriptions_short;
        this.descriptions_long  = descriptions_long;
        this.cover_i            = cover_i;
        this.cover_url          = cover_url;
        this.editorial          = editorial;
        this.author             = author;
    }
}

module.exports = BookDataSearch;