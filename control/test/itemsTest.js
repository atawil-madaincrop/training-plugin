


import Items from '../../repository/Items.js';
import Item from '../../entities/Item.js';

mocha.setup('bdd');

mocha.setup({
    globals: ['*']
});

mocha.checkLeaks();


let expect = chai.expect;


let newItem = new Item({
    title: "test analytics",
    subtitle: "desc",
    description: "desc",
    image: "image",
    link: "link",
    date: "date",
});



describe('Test', async function () {
    it('Item Properties Test =>', function () {
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
    it('Item Insert Test ==>', async function () {
        let insertedItem = await Items.insert(newItem);
        newItem.id = insertedItem.id;
        expect(insertedItem).to.be.an('Object');
    });

    it('Item Find by id Test ==>', async function () {
        let res = await Items.find(newItem.id);
        expect(await Items.find(newItem.id)).to.be.an('Object');
    });
    it('Empty Item Find Test ==>', async function () {
        expect(await Items.find()).to.be.an('Object');
    });

    it('Item Search Test ==>', async function () {
        let res = await Items.search({ search: 'test' });
        expect(res).to.be.an('Array');
        expect(res.length).to.be.an('Number');
        expect(res.length).to.be.above(0);
    });

    it('Item Search Empty String Test ==>', async function () {
        let res = await Items.search({});
        expect(res.length).to.be.above(0);
    });
    it('Item Search Invalid Item Test ==>', async function () {
        let res = await Items.search('ggggggggggggggggggggggggggggggggggggggggg');
        expect(res.length).to.equal(0);
    });

    it('Item Update Test ==>', async function () {
        newItem.title = "test analytics updated";
        let res = await Items.update(newItem);
        expect(res).to.be.an('Object');
        expect(res.data.title).to.equal("test analytics updated");
    });

    it('Item Delete Test ==>', async function () {
        let res = await Items.delete(newItem);
        expect(res).to.be.an('Object');
        expect(res.status).to.equal('deleted');
    });
})



mocha.run();

