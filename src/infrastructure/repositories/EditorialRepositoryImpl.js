const EditorialModel      = require('../../infrastructure/database/models/EditorialModel');
const EditorialRepository = require('../../domain/repositories/EditorialRepository');
const Editorial           = require('../../domain/entities/Editorial');

class EditorialRepositoryImpl extends EditorialRepository {
    constructor() {
        super();
        this.editorials = [];
    }

    async save(editorial) {
        const newEditorial = new EditorialModel(editorial);
        await newEditorial.save();
        return new Editorial(newEditorial._id, newEditorial.name, newEditorial.country, newEditorial.birthday);
    }

    async update(editorial) {
        const updatedEditorial = await EditorialModel.findByIdAndUpdate(editorial._id, editorial, { new: true });
        if (updatedEditorial) {
            return new Editorial(updatedEditorial._id, updatedEditorial.key, updatedEditorial.name, updatedEditorial.country, updatedEditorial.birthday);
        }
        return null;
    }

    async delete(id) {
        const deletedEditorial = await EditorialModel.findByIdAndDelete(id);
        return deletedEditorial;
    }
    
    async findById(id) {
        const Editorial = await EditorialModel.findById(id);
        if (Editorial) {
            return new Editorial(Editorial._id, Editorial.name, Editorial.country, Editorial.birthday);
        }
        return null;
    }
}

module.exports = EditorialRepositoryImpl;