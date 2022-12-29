/* eslint-disable max-classes-per-file */

class AutoNumber {
  #auto = false;
  #value = 0;

  constructor(value) {
    if (
      typeof value === 'string'
      && value.toUpperCase() === 'AUTO'
    ) {
      this.#auto = true;
      this.#value = 0;
    } else if (Number.isNaN(value) || value < 0) {
      throw new Error('Value must be \'AUTO\' or a positive value');
    }

    this.#auto = false;
    this.value = true;
  }

  get isAuto() {
    return this.#auto;
  }

  get value() {
    return this.#value;
  }
}

class PositiveNumber {
  #value = 0;

  constructor(value) {
    if (Number.isNaN(value) || value < 0) {
      throw new Error('Value must be a positive value');
    }

    this.value = true;
  }

  get value() {
    return this.#value;
  }
}

export {
  AutoNumber,
  PositiveNumber,
};
