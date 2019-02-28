import users from './../../data/users.json';
import companies from './../../data/companies.json';

import { findById, formatUserName, formatDate } from './functions';

export default class Table {

  constructor(headers, container) {
    this.el = document.createElement('table');
    this.el.className = 'table table-striped';

    const headerRow = this.el.createTHead().insertRow();
    for (let i = 0; i < headers.length; i++) {
      headerRow.insertCell().textContent = headers[i];
    }

    this.tbody = document.createElement('tbody');
    this.el.appendChild(this.tbody);

    container.appendChild(this.el);
  }

  addRow(order) {
    const newRow = this.tbody.insertRow();
    newRow.setAttribute('id', `order_${order.id}`);

    const orderDate = new Date(+order.created_at * 1000);
    const printDate = orderDate.toLocaleString().replace(',', '');

    const printCardNumber = order.card_number.split('').fill('*', 2, -4).join('');

    const user = findById(users, order.user_id);
    const company = user.company_id ? findById(companies, user.company_id) : null;

    newRow.insertAdjacentHTML('beforeend', `
      <td>${order.transaction_id}</td>
      <td class="user_data">
        ${formatUserName(user)}
        <div class="user-details">
            ${user.birthday ? `<p>Birthday: ${formatDate(user.birthday)}</p>` : ''}
            ${user.avatar ? `<p><img src="${user.avatar}"></p>` : ''}
            ${company ? `<p>Company: <a href="${company.url || ''}" target="_blank">${company.title}</a></p>` : ''}
            ${company ? `<p>${company.industry}</p>` : ''}
        </div>
      </td>
      <td>${printDate}</td>
      <td>$${order.total}</td>
      <td>${printCardNumber}</td>
      <td>${order.card_type}</td>
      <td>${order.order_country} (${order.order_ip})</td>
    `);

    this.initUserInfo(newRow);
  }

  initUserInfo(row) {
    const link = row.querySelector('.user_data > a');

    link.addEventListener('click', e => {
      e.preventDefault();

      e.currentTarget.nextElementSibling.classList.toggle('visible');
    })
  }
}
