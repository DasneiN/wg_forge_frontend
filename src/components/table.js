import { findById, formatUserName, formatDate, convertData } from './functions';

export default class Table {

  constructor(headers, container, data) {
    this.companies = data.companies;

    this.el = document.createElement('table');
    this.el.className = 'table table-striped table-bordered';

    const headerRow = this.el.createTHead().insertRow();

    Object.keys(headers).forEach(v => {
        const newTD = headerRow.insertCell();
        newTD.innerHTML = headers[v] + '<span>&#8595;</span>';
        newTD.setAttribute('data-sort-prop', v);
    });

    this.tbody = document.createElement('tbody');
    this.el.appendChild(this.tbody);

    container.appendChild(this.el);

    this.data = convertData(data.users, data.companies, data.orders);
    this.drawTable();

    this.initTableSort();
  }

  drawTable() {
    this.data.forEach(row => {
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

  reDraw() {
    this.tbody.innerHTML = '';
    this.drawTable();
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
      el.addEventListener('click', (e) => {
        this.sortTable(el.dataset.sortProp, e.currentTarget);
      });
    });
  }

  sortTable(sortProp, sortTD) {
    if (sortProp !== 'card_number') {
      const currentActive = this.el.querySelector('thead td.active');
      if (currentActive) {
        currentActive.classList.remove('active');
      }
      sortTD.classList.add('active');

      if (sortProp == 'user') {
        this.data.sort((a, b) => {
          const a_name = `${a.user.first_name} ${a.user.last_name}`;
          const b_name = `${b.user.first_name} ${b.user.last_name}`;

          if (a_name < b_name) {
            return -1;
          }

          if (a_name > b_name) {
            return 1;
          }

          return 0;
        });
      } else if (sortProp == 'location') {
        this.data.sort((a, b) => {
          const a_location = `${a.order_country} ${a.order_ip}`;
          const b_location = `${b.order_country} ${b.order_ip}`;

          if (a_location < b_location) {
            return -1;
          }

          if (a_location > b_location) {
            return 1;
          }

          return 0;
        });
      } else {
        if (isNaN(+this.data[0][sortProp])) {
          this.data.sort((a, b) => {
            if (a[sortProp] < b[sortProp]) {
              return -1;
            }

            if (a[sortProp] > b[sortProp]) {
              return 1;
            }

            return 0;
          });
        } else {
          this.data.sort((a, b) => {
            return a[sortProp] - b[sortProp];
          });
        }
      }
    }

    // console.clear();
    console.log('-----------------');
    console.log(sortProp);
    // console.table(this.data);
    // console.log(this.data.map(v => v.user));
    // console.log('-----------------');

    this.reDraw();
  }
}
