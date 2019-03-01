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

  const table = new Table(tableHeaders, container, {companies, users, orders});
}());
