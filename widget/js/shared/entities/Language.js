class Language {
    constructor(data = {}) {
        this.id = data.id || undefined;
        this.search = data.search || null;
        this.sortAscending = data.sortAscending || null;
        this.sortDescending = data.sortDescending || null;

        this.createdOn = data.createdOn || new Date();
        this.createdBy = data.createdBy || null;
        this.lastUpdatedOn = data.lastUpdatedOn || new Date();
        this.lastUpdatedBy = data.lastUpdatedBy || null;
        this.deletedOn = data.deletedOn || null;
        this.deletedBy = data.deletedBy || null;
        this.isActive = [0, 1].includes(data.isActive) ? data.isActive : 1;
    }
}