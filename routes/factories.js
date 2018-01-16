const express = require('express');
const companyStore = require('json-fs-store')('store/companies');
const router = express.Router();

function isFactory(company) {
  if(company && company.company_type == "factory"){ //declare a helper function to determine if object has a company type and is a brand.
    return true // admittedly probably not the best place for this function, but it cleans up the conditionals a bit.
  }
  else{
    return false
  }
}

router.get('/', (req, res) => {
    companyStore.list((err, companies) => {
        if (err) throw err;
        let factories = companies.filter(company => isFactory(company))
          res.json(factories);
    });
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    companyStore.list((err, companies) => {
        if (err) throw err;
        let result = companies.find((company) =>{ // iterate through the array of companies
           return (isFactory(company) && company.name.includes(searchQuery)) // check to see if company is a brand and name includes the string from the search query
        });
        result ? res.json(result) : res.sendStatus(404); // return the resulting object as json for some yummy api consumption and 404 if not found.
    });
});

router.get('/:id', (req, res) => {
    companyStore.load(req.params.id, (err, company) => {
        if (err) throw err;
        if(isFactory(company)){ // Might be redundant, assuming all company id's are unique. But the extra protection shouldn't hurt.
          res.json(company);
      }
    });
});

router.delete('/:id', (req, res) => {
    companyStore.remove(req.params.id, (err) => {
        if (err) throw err;
        res.json({ message: 'Successfully deleted' });
    });
});

router.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const newFactory = {
      name: req.body.name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      city: req.body.city,
      state: req.body.state,
      company_type: "factory"
      };

    companyStore.add(newFactory, err => {
        if (err) throw err;
        res.json(newFactory);
    });
});

module.exports = router;
