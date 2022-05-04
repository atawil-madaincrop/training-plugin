const languageTests = (expect) => {
    let newLanguage = new Language({
        sortAscending: 'A-Z'
    });

    describe('Language Test Part', function () {
        describe('Object Properties Part ==> ', function () {
            it('Language Object Properties Test  ', function () {
                expect(newLanguage).to.be.an('Object');
                expect(newLanguage).to.have.property('id');
                expect(newLanguage).to.have.property('search');
                expect(newLanguage).to.have.property('sortAscending');
                expect(newLanguage).to.have.property('sortDescending');
                expect(newLanguage).to.have.property('createdOn');
                expect(newLanguage).to.have.property('createdBy');
                expect(newLanguage).to.have.property('lastUpdatedOn');
                expect(newLanguage).to.have.property('lastUpdatedBy');
                expect(newLanguage).to.have.property('deletedOn');
                expect(newLanguage).to.have.property('deletedBy');
                expect(newLanguage).to.have.property('isActive');
            });
        });

        describe('Language Save Test --> ', async function () {
            it('Should Save the Language to the datastore ', async function () {
                let savedResult = await Languages.save(newLanguage);
                expect(savedResult.data).to.be.an('Object');
                expect(savedResult.data.sortAscending).to.equal('A-Z');
                expect(savedResult.data).to.have.property('isActive');
            });

            it('Save Empty Atgument, should throw an error ', async function () {
                let savedResult;

                try {
                    savedResult = await Languages.save();
                } catch (err) {
                    savedResult = err;
                }

                expect(savedResult).to.be.an('String');
            });
        });

        describe('Language Get Test --> ', async function () {
            it('Get Language from DataStore ', async function () {
                let getResult = await Languages.get();
                expect(getResult.data).to.be.an("Object");
                expect(getResult.data).to.have.property('isActive');
            });
        });
    });
};