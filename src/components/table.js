import users from './../../data/users.json';
import companiesJSON from './../../data/companies.json';
import orders from './../../data/orders.json';

import { findById, formatUserName, formatDate } from './functions';

export default class Table {

  constructor(headers, container) {
    this.companies = companiesJSON;

    this.el = document.createElement('table');
    this.el.className = 'table table-striped table-bordered';

    const headerRow = this.el.createTHead().insertRow();
    for (let i = 0; i < headers.length; i++) {
      const newTD = headerRow.insertCell();
      newTD.innerHTML = headers[i] + '<span>&#8595;</span>';
      newTD.setAttribute('data-sort-prop', headers[i]);
    }

    this.tbody = document.createElement('tbody');
    this.el.appendChild(this.tbody);

    container.appendChild(this.el);

    this.initTableSort();
  }

  drawTable(data) {
    data.forEach(row => {
      const newRow = this.tbody.insertRow();
      newRow.setAttribute('id', `order_${row.id}`);

      const orderDate = new Date(+row.created_at * 1000);
      const printDate = orderDate.toLocaleString().replace(',', '');

      const printCardNumber = row.card_number.split('').fill('*', 2, -4).join('');

      const {user} = row;
      const company = user.company_id ? findById(this.companies, user.company_id) : null;

      newRow.insertAdjacentHTML('beforeend', `
      <td>${row.transaction_id}</td>
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
      <td>$${row.total}</td>
      <td>${printCardNumber}</td>
      <td>${row.card_type}</td>
      <td>${row.order_country} (${row.order_ip})</td>
    `);

      this.initUserInfo(newRow);
    });
  }

  initUserInfo(row) {
    const link = row.querySelector('.user_data > a');

    link.addEventListener('click', e => {
      e.preventDefault();

      e.currentTarget.nextElementSibling.classList.toggle('visible');
    })
  }

  initTableSort() {
    const headers = this.el.querySelectorAll('.table thead td');

    headers.forEach(el => {
      el.addEventListener('click', () => {this.sortTable(el.dataset.sortProp)});
    });
  }

  sortTable(sortProp) {
    this.companies.sort((a,b) => {
      if (a[sortProp] < b[sortProp]) {
        return -1;
      }

      if (a[sortProp] > b[sortProp]) {
        return 1;
      }

      return 0;
    });

    console.log('-----------------');
    console.log(this.companies);
    console.log('-----------------');
  }
}
