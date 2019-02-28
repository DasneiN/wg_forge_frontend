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
