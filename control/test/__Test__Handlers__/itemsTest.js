


import Items from '../../../widget/common/repository/Items.js';
import Item from '../../../widget/common/entities/Item.js';
import {Constants} from '../../../widget/common/config/Constants.js';


const itemTest = (mocha, expect) => {
    
    
    // create new item Object
    let newItem = new Item({
        title: "test analytics",
        subtitle: "desc",
        description: "desc",
        image: "image",
        link: "link",
        date: "date",
    });

    // check expected result for our item functionalities
    describe('Test Part ==> ', async function () {
        // check if item is an object and it's properties
        describe(`${Constants.TEST_ITEM_PROPERTIES} -->`,async function(){
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
        })
        // check if item can be inserted into database
        describe(`${Constants.TEST_ITEM_INSERT_FUNCTION} -->`, async function(){
            it('check if item can be inserted into database', async function () {
                let insertedItem = await Items.insert(newItem);
                newItem.id = insertedItem.id;
                expect(insertedItem).to.be.an('Object');
            });
        })
        describe(`${Constants.TEST_ITEM_FIND_FUNCTION} -->`, async function(){
            // check if item can be found by id
            it('Find by id Test', async function () {
                let res = await Items.find(newItem.id);
                expect(res.data).to.be.an('Object');
            });
            // check if empty item can be found
            it(`Empty Find Test `, async function () {
                let res = await Items.find();
                expect(res.data).to.be.an('Object');
            });
        })
        describe(`${Constants.TEST_ITEM_SEARCH_FUNCTION} -->`,async function(){
            // check if item can be searched
            it('check if item can be searched', async function () {
                let res = await Items.search({ search: 'test' });
                expect(res).to.be.an('Array');
                expect(res.length).to.be.an('Number');
                expect(res.length).to.be.above(0);
            });
            // check if item can be searched with empty string
            it(`Search for Empty String Test `, async function () {
                let res = await Items.search({});
                expect(res.length).to.be.above(0);
            });
            // check if item can be searched with invalid item
            it(`Search for Invalid Item Test`, async function () {
                let res = await Items.search('This Item Is not Available in the Database To check the Search Functionality'); 
                expect(res.length).to.equal(0);
            });
        })
        describe(`${Constants.TEST_ITEM_UPDATE_FUNCTION} -->`,async function(){
            // check if item can be updated
            it('check if item can be updated', async function () {
                newItem.title = "test analytics updated";
                let res = await Items.update(newItem);
                expect(res.data).to.be.an('Object');
                expect(res.data.title).to.equal("test analytics updated");
            });
        })
        describe(`${Constants.TEST_ITEM_DELETE_FUNCTION} -->`,async function () {
            // check if item can be deleted
            it('check if item can be deleted', async function () {
                let res = await Items.delete(newItem);
                expect(res).to.be.an('Object');
                expect(res.status).to.equal('deleted');
            });
        })
    })

    // run all tests
    mocha.run();

}    



export default itemTest;