import Items from '../../../widget/common/repository/Items.js';
import Item from '../../../widget/common/entities/Item.js';

export const itemsTests1 = (expect) => {
    describe('Item', () => {
        const item = new Item();

        it('Item is an object', () => {
            expect(item).to.be.an('object');
        });

        it('Item properties', function () {
            expect(item).to.have.property('id');
            expect(item).to.have.property('title');
            expect(item).to.have.property('subtitle');
            expect(item).to.have.property('description');
            expect(item).to.have.property('image');
            expect(item).to.have.property('coverImage');
            expect(item).to.have.property('createdOn');
            expect(item).to.have.property('createdBy');
            expect(item).to.have.property('lastUpdatedOn');
            expect(item).to.have.property('lastUpdatedBy');
            expect(item).to.have.property('deletedOn');
            expect(item).to.have.property('deletedBy');
            expect(item).to.have.property('isActive');
        });
    });

    describe('Items', () => {
        describe('#search()', () => {
            it('search with no options argument is an array', async () => {
                const items = await Items.search();
                console.log('items:', items);
                expect(items).to.be.an('array');
            });

            it('search with empty options is an array', async () => {
                const items = await Items.search({});
                expect(items).to.be.an('array');
            });

            it('search with input item is an array and is not empty', async () => {
                const items = await Items.search({ search: 'item' });
                expect(items).to.be.an('array');
                expect(items).to.have.length.above(0);
            });

            it('search with big input is an array', async () => {
                const items = await Items.search({ search: 'ITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEMITEM' });
                expect(items).to.be.an('array');
            });

            it('search with input type integers is an array', async () => {
                const items = await Items.search({ search: 33 });
                expect(items).to.be.an('array');
            });
        });

        describe('#find()', () => {
            it('find item with valid id should be object', async () => {
                let item = await Items.find("62573728985c3e0376ee651c");
                expect(item).to.be.an('object');
            });

            it('find item with invalid id should be undefined', async () => {
                let item;

                try {
                    item = await Items.find("62573728985c3e0376ee651css");
                } catch (err) {

                }

                expect(item).to.be.an('undefined');
            });

            it('find item with no id should be undefined ', async () => {
                let item;

                try {
                    item = await Items.find();
                } catch (err) {

                }

                expect(item).to.be.an('undefined');
            });

            it('find item with empty string id should be undefined ', async () => {
                let item;

                try {
                    item = await Items.find("");
                } catch (err) {

                }

                expect(item).to.be.an('undefined');
            });
        });


        describe('#insert()', () => {
            it('insert an item should be an item', async () => {
                let item = new Item({ id: "62573728820890036e8e6d93", subtitle: "item updated 2" });
                let res = await Items.update(item.id, item);
                console.log('res: ', res.data);
                expect(res.data).to.be.an('object');
            });

            it('insert an empty object should be undefined', async () => {
                let res;

                try {
                    res = await Items.insert({});
                } catch (err) {

                }

                expect(res?.data).to.be.an('undefined');
            });
        });

        describe('#update()', () => {
            it('update an item should be an item', async () => {
                let item = new Item();
                let res = await Items.insert(item);
                expect(res.data).to.be.an('object');
            });

            it('update an empty object should be undefined', async () => {
                let res;

                try {
                    res = await Items.update({});
                } catch (err) {

                }

                expect(res?.data).to.be.an('undefined');
            });

            it('update an item with wrong id should be undefined', async () => {
                let res;
                let item = new Item();

                try {
                    res = await Items.update("213123123", item);
                } catch (err) {

                }

                expect(res?.data).to.be.an('undefined');
            });
        });

        describe('#delete()', () => {
            it('delete a valid item', async () => {
                let item = new Item({ id: "62597faa08c3a90378bc8a17" });
                let res = await Items.delete(item.id, item);
                expect(res?.data).to.be.an('object');
            });

            it('delete with an invalid id and item should be undefined', async () => {
                let res;

                try {
                    res = await Items.delete("123123123123", {});
                } catch (err) {

                }

                expect(res?.data).to.be.an('undefined');
            });

            it('deleted item has a null deletedOn property', async () => {
                let item = new Item({ id: "62597c1bd633a0037f9dac1a" });
                let res = await Items.delete(item.id, item);
                expect(res?.data).to.be.have.property('deletedOn');
                expect(res?.data.deletedOn).to.be.an('string');
            });
        });
    });

    describe('#forceDelete()', () => {
        it('force delete a valid item if found', async () => {
            let res;
            let item = new Item({ id: "62597e32d633a0037f9dac28" });

            try {
                res = await Items.forceDelete(item.id);
                expect(res?.status).to.equal('deleted');
            } catch (e) {
                expect(res?.status).to.be.an('undefined');
            }
        });

        it('force delete with an invalid id', async () => {
            let res;

            try {
                res = await Items.forceDelete("123123123123");
            } catch (err) {

            }

            expect(res?.data).to.be.an('undefined');
        });
    });
}