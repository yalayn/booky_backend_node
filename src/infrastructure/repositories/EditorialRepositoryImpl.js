const EditorialModel      = require('../../infrastructure/database/models/EditorialModel');
const EditorialRepository = require('../../domain/repositories/EditorialRepository');
const Editorial           = require('../../domain/entities/Editorial');
const normalizeText       = require('../../utils/normalizeText');

class EditorialRepositoryImpl extends EditorialRepository {
    constructor() {
        super();
        this.editorials = [];
    }

    async save(editorial) {
        editorial.normalizedName = normalizeText(editorial.name);
        const newEditorial = new EditorialModel(editorial);
        await newEditorial.save();
        return newEditorial;
    }

    async update(editorial) {
        const existingEditorial = await EditorialModel.findOne({ _id: editorial._id });
        if (!existingEditorial) { throw new Error('Editorial not found'); }
        editorial.normalizedName = editorial.name ? normalizeText(editorial.name) : normalizeText(editorial.normalizedName);
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

    async upsert(editorial) {
        editorial.normalizedName = normalizeText(editorial.name);
        const existingEditorial  = await EditorialModel.findOne({ normalizedName: editorial.normalizedName });
        return existingEditorial || this.save(editorial);
        
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