class Introduction {
    constructor(data = {}) {
        this.id = data.id || undefined;
        this.imageCarousel = data.imageCarousel || [];
        this.description = data.description || '';

        this.createdOn = data.createdOn || new Date();
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || new Date();
        this.lastUpdatedBy = data.lastUpdatedBy || null;
        this.deletedOn = data.deletedOn || null;
        this.deletedBy = data.deletedBy || null;
        this.isActive = [0, 1].includes(data.isActive) ? data.isActive : 1;
    }
}