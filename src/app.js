import Table from './components/table.js';

import users from '../data/users.json';
import companies from '../data/companies.json';
import orders from '../data/orders.json';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './scss/style.scss';
import { convertData } from './components/functions.js';

export default (function () {
  const app = document.getElementById('app');

  const container = document.createElement('div');
  container.classList.add('container-fluid');
  app.appendChild(container);

  const table = new Table([
    'Transaction ID',
    'User Info',
    'Order Date',
    'Order Amount',
    'Card Number',
    'Card Type',
    'Location'
  ], container);

  const data = convertData(users, companies, orders);
  table.drawTable(data);
}());
