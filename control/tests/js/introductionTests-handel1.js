
let lastntroductionData ;
const introductionTests = (expect) => {
    let newIntroduction = new Introduction({
        description: 'Introduction to test our Functionality'
    });
    
    describe('Introduction Test Part ==> ', function () {
        describe('Object Properties Part --> ', function () {
            it('Introduction Object Properties Test ', function () {
                expect(newIntroduction).to.be.an('Object');
                expect(newIntroduction).to.have.property('id');
                expect(newIntroduction).to.have.property('imageCarousel');
                expect(newIntroduction).to.have.property('description');
                expect(newIntroduction).to.have.property('createdOn');
                expect(newIntroduction).to.have.property('createdBy');
                expect(newIntroduction).to.have.property('lastUpdatedOn');
                expect(newIntroduction).to.have.property('lastUpdatedBy');
                expect(newIntroduction).to.have.property('deletedOn');
                expect(newIntroduction).to.have.property('deletedBy');
                expect(newIntroduction).to.have.property('isActive');
            });

        });

        describe('Introduction Save Test --> ', async function () {
            lastntroductionData = await Introductions.get();
            it('Should Save the Introduction to the datastore ', async function () {
                let savedResult = await Introductions.save(newIntroduction);
                expect(savedResult.data).to.be.an('Object');
                expect(savedResult.data.description).to.equal('Introduction to test our Functionality');
                expect(savedResult.data).to.have.property('isActive');
            });

            it('Save Empty Atgument, should throw an error ', async function () {
                let savedResult;

                try {
                    savedResult = await Introductions.save();
                } catch (err) {
                    savedResult = err;
                }

                expect(savedResult).to.be.an('String');
            });
        })

        describe('Introduction Get Test --> ', async function () {
            it('Get Introduction from DataStore  ', async function () {
                let getResult = await Introductions.get();
                expect(getResult.data).to.be.an("Object");
                expect(getResult.data).to.have.property('isActive');
            });
        });
        Introductions.save(lastntroductionData);
    });
}