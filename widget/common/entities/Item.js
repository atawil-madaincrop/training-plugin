export default class Item {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || null;
        this.subtitle = data.subtitle || null;
        this.description = data.description || null;
        this.image = data.image || null;
        this.coverImage = data.coverImage || null;

        this.createdOn = data.createdOn || new Date();
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || new Date();
        this.lastUpdatedBy = data.lastUpdatedBy || null;
        this.deletedOn = data.deletedOn || null;
        this.deletedBy = data.deletedBy || null;
        this.isActive = [0, 1].includes(data.isActive) ? data.isActive : 1;
    }
}