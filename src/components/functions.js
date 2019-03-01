export function findById(arr, id) {
  return arr.filter(v => v.id === id)[0];
}

export function formatUserName(user) {
  return `<a href="#">${user.gender === 'Male' ? 'Mr.' : 'Ms.'} ${user.first_name} ${user.last_name}</a>`;
}

export function formatDate(timestamp) {
  const date = new Date(+timestamp * 1000);

  const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
  const month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function convertData(users, companies, orders) {
  const data = [];

  orders.forEach(order => {

    const userObj = findById(users, order.user_id);

    data.push({
      order_id: order.id,
      transaction_id: order.transaction_id,
      created_at: order.created_at,
      card_number: order.card_number,
      user: userObj,
      company: userObj.company_id ? findById(companies, userObj.company_id) : null,
      total: order.total,
      card_type: order.card_type,
      order_country: order.order_country,
      order_ip: order.order_ip,
    });
  });

  return data;
}
