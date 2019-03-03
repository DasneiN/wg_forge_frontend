import Table from './components/table.js';

import users from '../data/users.json';
import companies from '../data/companies.json';
import orders from '../data/orders.json';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './scss/style.scss';

const tableHeaders = {
  transaction_id: 'Transaction ID',
  user: 'User Info',
  created_at: 'Order Date',
  total: 'Order Amount',
  card_number: 'Card Number',
  card_type: 'Card Type',
  location: 'Location',
};

export default (function () {
  const app = document.getElementById('app');

  const container = document.createElement('div');
  container.classList.add('container-fluid');
  app.appendChild(container);

  // fetch('https://api.exchangeratesapi.io/latest?base=USD')
  //   .then((res, err) => {
  //     return res.json();
  //   })
  //   .then((r, e) => {
  //     console.log(r);
  //   });

  Promise.all([
    fetch('http://localhost:9000/api/companies.json').then(v => v.json()),
    fetch('http://localhost:9000/api/users.json').then(v => v.json()),
    fetch('http://localhost:9000/api/orders.json').then(v => v.json()),
  ])
  .then(([companies, users, orders]) => {
    const data = {
      companies,
      users,
      orders,
    };

    app.table = new Table(tableHeaders, container, data);
  })
  .catch(err => {
    console.log(err);
  });
}());
