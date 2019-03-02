import { findById, formatUserName, formatDate, convertData } from './functions';

export default class Table {

  constructor(headers, container, data) {
    this.companies = data.companies;

    this.el = document.createElement('table');
    this.el.className = 'table table-striped table-bordered';

    this.thead = this.el.createTHead();
    const headerRow = this.thead.insertRow();

    Object.keys(headers).forEach(v => {
      const newTD = document.createElement('th');
      newTD.innerHTML = headers[v] + '<span>&#8595;</span>';
      newTD.setAttribute('data-sort-prop', v);
      headerRow.appendChild(newTD);
    });

    this.tbody = document.createElement('tbody');
    this.el.appendChild(this.tbody);

    container.appendChild(this.el);

    this.data = convertData(data.users, data.companies, data.orders);

    this.drawTable();
    this.drawTableFooter();
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
    const headers = this.thead.querySelectorAll('th');

    headers.forEach(el => {
      el.addEventListener('click', (e) => {
        this.sortTable(el.dataset.sortProp, e.currentTarget);
      });
    });
  }

  sortTable(sortProp, sortTD) {
    if (sortProp !== 'card_number') {
      const currentActive = this.thead.querySelector('th.active');
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

    console.log('-----------------');
    console.log(sortProp);

    this.reDraw();
  }

  drawTableFooter() {
    this.tfoot = this.el.appendChild(document.createElement('tfoot'));

    this.stats = this.calcTableStatistic();

    const colspan = 6;

    this.tfoot.insertAdjacentHTML('beforeend', `
      <tr>
        <td>Orders Count</td>
        <td colspan="${colspan}">${this.stats.orders_count}</td>
      </tr>
      <tr>
        <td>Orders Total</td>
        <td colspan="${colspan}">${this.stats.orders_total}</td>
      </tr>
      <tr>
        <td>Median Value</td>
        <td colspan="${colspan}">$ ${this.stats.median_value}</td>
      </tr>
      <tr>
        <td>Average Check</td>
        <td colspan="${colspan}">$ ${this.stats.average_check}</td>
      </tr>
      <tr>
        <td>Average Check (Female)</td>
        <td colspan="${colspan}">$ ${this.stats.average_check_male}</td>
      </tr>
      <tr>
        <td>Average Check (Male)</td>
        <td colspan="${colspan}">$ ${this.stats.average_check_female}</td>
      </tr>
    `);
  }

  calcTableStatistic() {
    const orders_count = this.data.length;
    const orders_total = (this.data.reduce((ac, v) => ac + v.total * 100, 0) / 100);
    const average_check = Math.round((orders_total * 100 / orders_count)) / 100;

    const dataMale = this.data.filter(v => v.user.gender === 'Male');
    const orders_count_male = dataMale.length;
    const orders_total_male = (dataMale.reduce((ac, v) => ac + v.total * 100, 0) / 100);
    const average_check_male = Math.round((orders_total_male * 100 / orders_count_male)) / 100;

    const dataFemale = this.data.filter(v => v.user.gender === 'Female');
    const orders_count_female = dataFemale.length;
    const orders_total_female = (dataFemale.reduce((ac, v) => ac + v.total * 100, 0) / 100);
    const average_check_female = Math.round((orders_total_female * 100 / orders_count_female)) / 100;

    const totals = this.data
      .map(v => +v.total)
      .sort((a, b) => {
        return a - b;
      });

    const median_value = totals.length % 2
      ? totals[Math.floor(totals.length / 2)]
      : Math.round((totals[totals.length / 2 - 1] * 100 + totals[totals.length / 2 - 1] * 100) / 2 ) / 100;

    return {
      orders_count,
      orders_total,
      average_check,
      average_check_male,
      average_check_female,
      median_value,
    };
  }
}
