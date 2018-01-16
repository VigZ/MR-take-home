const request = require('supertest');

var testBrand = {
  id: "testId",    //this test factory will be used for creating and deleting tests.
  name: 'Test Brand',
  email: "test@email.com",
  phone_number: "555-555-5555",
  city: "New York",
  state: "NY",
  company_type: "brand"
};

describe('Brands', () => {
    let app;
    beforeEach(() => {
        app = require('../app.js');
    });
    afterEach(() => {
        app.close();
    });

    it('gets all brands', done => {
        request(app)
            .get('/brands')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.length).toBeGreaterThan(0);
                done(res);
            });
    });

    it('gets a single brand', done => {
        request(app)
            .get('/brands/d38c2e1e-be0b-4357-9629-ff54f9bbdcb2') // admittedly, this is an ugly id.
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('creates a new brand', done => {
        request(app)
            .post('/brands')
            .send({ name: 'Test Brand',
            email: "test@email.com",
            phone_number: "555-555-5555",
            city: "New York",
            state: "NY",
            company_type: "brand"
          })
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.name).toEqual('Test Brand')
                expect(res.body.email).toEqual('test@email.com');
                expect(res.body.phone_number).toEqual('555-555-5555');
                expect(res.body.city).toEqual('New York');
                expect(res.body.state).toEqual('NY');
                expect(res.body.state.length).toEqual(2); // Enforcing a 2 character format seems correct.
                expect(res.body.company_type).toEqual('brand');

                testBrand = res.body;
                done(res);
            });
    });
    it('deletes a brand', function(done){

    request(app)
        .delete('/brands/' + testBrand.id)
        .expect(200)
        .end((err, res) => {
          if (err) return done.fail(err);
          done(res);
        });
});

    it('finds an existing brand', done => {
        request(app)
            .get('/brands/search?q=Brandy Brand') //referring to the name
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('returns 404 when it can\'t find a brand', done => {
        request(app)
            .get('/brands/search?q=foo bar')
            .expect(404)
            .end((err, res) => {
                if (err) return done.fail(err);
                done(res);
            });
    });
});
