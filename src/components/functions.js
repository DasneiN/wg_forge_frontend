export function findUserById(arr, id) {
  return arr.filter(v => v.id === id)[0];
}

export function formatUserName(user) {
  return `<a href="#">${user.gender === 'Male' ? 'Mr.' : 'Ms.'} ${user.first_name} ${user.last_name}</a>`;
}
