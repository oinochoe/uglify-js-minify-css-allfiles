class ModernBank {
  // Private fields
  #balance = 0;
  #transactionHistory = [];

  // Public field
  accountType = 'Checking';

  // Static private field
  static #bankName = 'Modern JS Bank';

  // Static public field
  static exchangeRate = 1.2;

  // Static initialization block
  static {
    console.log(`${this.#bankName} is initializing...`);
  }

  constructor(initialBalance) {
    this.#balance = initialBalance;
    this.#addTransaction('Initial deposit', initialBalance);
  }

  // Private method
  #addTransaction(description, amount) {
    this.#transactionHistory.push({ description, amount, date: new Date() });
  }

  // Public method
  deposit(amount) {
    this.#balance += amount;
    this.#addTransaction('Deposit', amount);
  }

  // Public method with optional chaining and nullish coalescing
  withdraw(amount, { fee, description } = {}) {
    const totalAmount = amount + (fee ?? 0);
    if (this.#balance >= totalAmount) {
      this.#balance -= totalAmount;
      this.#addTransaction(description?.trim() || 'Withdrawal', -amount);
      if (fee) this.#addTransaction('Withdrawal fee', -fee);
      return true;
    }
    return false;
  }

  // Getter
  get balance() {
    return this.#balance;
  }

  // Static method
  static convertCurrency(amount) {
    return amount * this.exchangeRate;
  }

  // Async method
  async getTransactionHistory() {
    // Simulating an async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return this.#transactionHistory;
  }

  // Method using the logical assignment operator
  updateAccountType(newType) {
    this.accountType ||= newType;
  }

  // toString method using template literals
  toString() {
    return `ModernBank account (${this.accountType}) - Balance: $${this.#balance}`;
  }
}

// Usage example
(async () => {
  const account = new ModernBank(1000);
  account.deposit(500);
  account.withdraw(200, { fee: 5, description: 'ATM withdrawal ' });
  account.updateAccountType('Savings');

  console.log(account.toString());
  console.log(`Balance: $${account.balance}`);
  console.log(`$100 in foreign currency: $${ModernBank.convertCurrency(100)}`);

  const history = await account.getTransactionHistory();
  console.log('Transaction History:', history);
})();
