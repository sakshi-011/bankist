'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-01-20T17:01:17.194Z',
    '2022-01-22T23:36:17.929Z',
    '2022-01-23T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

//'2020-07-12T10:51:36.790Z'
const now = new Date();
const formatDate = date => {
  const days = Math.round(Math.abs(date - now) / 1000 / 60 / 60 / 24);
  return days === 0
    ? 'today'
    : days === 1
    ? 'yesterday'
    : days <= 7
    ? `${days} days ago`
    : `${date.getDate().toString().padStart(2, 0)}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, 0)}/${date.getFullYear()}`;
};

const displayMovements = function (acc, sort = false) {
  const movements = acc.movements;
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const displayDate = new Date(acc.movementsDates[i]);

    //     <div class="movements__date">${displayDate
    //       .getDate()
    //       .toString()
    //       .padStart(2, 0)}/${(displayDate.getMonth() + 1)
    //   .toString()
    //   .padStart(2, 0)}/${displayDate.getFullYear()}
    // </div>
    // <div class="movements__value">${mov.toFixed(2)}€</div>

    const formattedMov = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${formatDate(displayDate)}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //Display date
  // labelDate.textContent = `${now
  //   .getDate()
  //   .toString()
  //   .padStart(2, 0)}/${(now.getMonth() + 1)
  //   .toString()
  //   .padStart(2, 0)}/${now.getFullYear()}, ${now
  //   .getHours()
  //   .toString()
  //   .padStart(2, 0)}:${now
  //   .getSeconds()
  //   .toString()
  //   .padStart(2, 0)}`;

  //get locale from browser
  const locale = navigator.language;
  console.log(locale);

  labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: '2-digit',
    //month: 'long',
    year: 'numeric',
    weekday: 'short', //'long'
  }).format(now);
  // labelDate.textContent = new Intl.DateTimeFormat('hi-IN').format(now);

  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

const setLogOutTimer = function () {
  let initTime = 120;

  const tick = function () {
    const min = Math.floor(initTime / 60);
    const sec = initTime % 60;
    labelTimer.textContent = `${min.toString().padStart(2, 0)}:${sec
      .toString()
      .padStart(2, 0)}`;

    if (initTime === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    initTime--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = setLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = setLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';
  //Reset timer
  clearInterval(timer);
  timer = setLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

console.log(23 === 23.0);
console.log(0.1 + 0.2);
console.log(+'23');
console.log(Number.parseInt('30px30'));
console.log(Number.parseInt('e345'));
console.log(Number.parseFloat(' 2.5 rem '));
console.log(Number.isNaN(+'20mm'));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(30));
console.log(30 / 0);
console.log(Number.isFinite(30 / 0));

console.log('Square root of 1225', Math.sqrt(1225));
console.log(1225 ** (1 / 2));
console.log(Math.max(5, 6, 7, 8, '12', 9, Math.PI));

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

console.log(randomInt(3, 10));

//Rounding integers
console.log(Math.round(34.5666));
console.log(Math.ceil(25.9));
console.log(Math.floor('25.9'));
console.log(Math.round());

//Rounding decimals
console.log((2.78).toFixed(0));
console.log(+(3.5).toFixed(4));

console.log(103 % 9);
console.log(
  (function (n) {
    return n % 2 === 0;
  })(514)
);

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i % 3 === 0) row.style.backgroundColor = 'lightgrey';
  });
});

//numeric separators - ES2021
console.log(278_430_000_000);
const priceCents = 349_99;
console.log(priceCents);

//bigInt ES2020
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(87284783579345986534653459837593645692369829584795n);
console.log(5n);
console.log(BigInt(848448));
console.log(200n > 80);
console.log(
  237436478623746734673159349864834234673n + ' is a really big number'
);

console.log(10n / 3n);

//creating dates
const now1 = new Date();
console.log(now1);
console.log(new Date('Jan 22 2022 21:20:33'));
console.log(new Date('January 1, 2022'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2032, 9, 9, 15, 20, 8));
console.log(new Date(2037, 10, 37));
console.log('initial unix time ', new Date(0));
console.log('3 days later ', new Date(3 * 24 * 60 * 60 * 1000));

const date1 = new Date(2035, 7, 15, 15, 30);
console.log(date1);
console.log(
  'Year: ',
  date1.getFullYear(),
  ' Month: ',
  date1.getMonth() + 1,
  ' Day: ',
  date1.getDate()
);
console.log('Day of the week', date1.getDay());
console.log(
  `Hours: ${date1.getHours()} Minutes: ${date1.getMinutes()} Seconds: ${date1.getSeconds()}`
);
console.log(date1.toISOString());
console.log('Timestamp: ', date1.getTime());
console.log(Date.now());
console.log(new Date(Date.now()));

date1.setFullYear(2045);
console.log(date1);

const date2 = new Date(2035, 3, 12, 15, 30);
console.log('date: ', date2, 'timestamp: ', +date2);
console.log(date1 - date2);
const diff = (date1 - date2) / 1000 / 60 / 60 / 24;
console.log(diff / 365);

const num1 = 72365265.78365;
const options1 = {
  style: 'unit', //percent
  unit: 'mile-per-hour',
  useGrouping: false,
};
const options2 = {
  style: 'currency',
  //unit: 'celsius'
  currency: 'EUR',
};
console.log('US: ', new Intl.NumberFormat('en-US', options1).format(num1));
console.log('IN: ', new Intl.NumberFormat('hi-IN', options1).format(num1));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options2).format(num1));
console.log('US: ', new Intl.NumberFormat('en-US', options2).format(num1));

//setTimeout
//const ingreds = ['olives', 'spinach'];
const ingreds = ['tomatoes', 'cheese'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  5000,
  ...ingreds
);

if (ingreds.includes('spinach')) clearTimeout(pizzaTimer);

//setInterval
// setInterval(() => {
//   const now = new Date();
//   console.log(`${now.getMinutes()}:${now.getSeconds()}`);
// }, 1000);
