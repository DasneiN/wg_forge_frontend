import Table from './components/table.js';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './scss/style.scss';

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
}());
