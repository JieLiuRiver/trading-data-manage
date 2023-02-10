export function formatNum(num: number | string) {
  const numStr = String(num);
  const [integer, decimal = ''] = numStr.split('.');
  return (
    integer.replace(/\B(?=(\d{3})+$)/g, ',') + (decimal ? '.' + decimal : '')
  );
}

export function randomString(len: number) {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = len; i > 0; --i)
    result += str[Math.floor(Math.random() * str.length)];
  return result;
}
