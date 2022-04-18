import Items from '../../../widget/common/repository/Items.js';
import Item from '../../../widget/common/entities/Item.js';

export const itemsTests2 = (expect) => {
    let newItem = new Item({
        title: "test analytics",
        subtitle: "desc",
        description: "desc",
        image: "image",
        link: "link",
        date: "date",
    });

    describe('Test Part ==> ', async function () {
        describe('Item Properties Test -->', async function () {
            it('check properties of object', function () {
                expect(newItem).to.be.an('Object');
                expect(newItem).to.have.property('title');
                expect(newItem).to.have.property('subtitle');
                expect(newItem).to.have.property('description');
                expect(newItem).to.have.property('image');
                expect(newItem).to.have.property('coverImage');
                expect(newItem).to.have.property('createdOn');
                expect(newItem).to.have.property('createdBy');
                expect(newItem).to.have.property('lastUpdatedOn');
                expect(newItem).to.have.property('lastUpdatedBy');
                expect(newItem).to.have.property('deletedOn');
                expect(newItem).to.have.property('deletedBy');
                expect(newItem).to.have.property('isActive');
            });
        });

        describe('Item Insert Test -->', async function () {
            it('check if item can be inserted into database', async function () {
                let insertedItem = await Items.insert(newItem);
                newItem.id = insertedItem.id;
                expect(insertedItem).to.be.an('Object');
            });
        });

        describe('Item Find Test -->', async function () {
            it('Find by id Test', async function () {
                let res = await Items.find(newItem.id);
                expect(res.data).to.be.an('Object');
            });

            it(`Empty Find Test `, async function () {
                let res;

                try {
                    res = await Items.find();
                } catch (e) {
                    //
                }

                expect(res?.data).to.be.an('undefined');
            });
        });

        describe('Item Search Test -->', async function () {
            it('check if item can be searched', async function () {
                let res = await Items.search({ search: 'test' });
                expect(res).to.be.an('Array');
                expect(res.length).to.be.an('Number');
                expect(res.length).to.be.above(0);
            });

            it(`Search for Empty String Test `, async function () {
                let res = await Items.search({});
                expect(res.length).to.be.above(0);
            });

            it(`Search for Invalid Item Test`, async function () {
                let res = await Items.search('This Item Is not Available in the Database To check the Search Functionality');
                expect(res.length).to.equal(0);
            });
        });

        describe('Item Update Test -->', async function () {
            it('check if item can be updated', async function () {
                let res;

                newItem.title = "test analytics updated";

                try {
                    res = await Items.update(newItem.id, newItem);
                } catch (e) {
                    //
                }

                expect(res?.data).to.be.an('Object');
                expect(res?.data.title).to.equal("test analytics updated");
            });
        });

        describe('Item Delete Test -->', async function () {
            it('check if item can be deleted', async function () {
                let res = await Items.delete(newItem.id, newItem);
                expect(res).to.be.an('Object');
            });
        });
    });
}