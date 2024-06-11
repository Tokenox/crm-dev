import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  '123 Main St , USA',
  '456 Park Ave , USA',
  '789 Elm St , USA',
  '111 Oak Blvd , USA',
  '222 Maple St , USA',
  '333 Pine Ave , USA',
  '444 Cedar St , USA',
  '555 Birch Rd , USA',
  '666 Riverside Dr , USA',
  '777 Lakeview Dr , USA',
  '888 Mountain Rd , USA',
  '999 Ocean Ave , USA',
  '101 North St , USA',
  '202 South St , USA',
  '303 East St , USA',
  '404 West St , USA',
  '505 Central Ave , USA',
  '606 Hillside Dr , USA',
  '707 Sunset Blvd , USA',
  '808 Sunrise Ave , USA',
  '909 Valley Rd , USA',
  '1010 Forest Dr , USA',
  ];
const PRODUCT_COLOR = ['#00AB55', '#000000', '#FFFFFF', '#FFC0CB', '#FF4842', '#1890FF', '#94D82D', '#FFC107'];

// ----------------------------------------------------------------------

const products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: faker.datatype.uuid(),
    cover: `/assets/images/products/product_${setIndex}.jpg`,
    name: PRODUCT_NAME[index],
    price: faker.datatype.number({ min: 500000, max: 999999, precision: 0.01 }),
    priceSale: setIndex % 3 ? null : faker.datatype.number({ min: 19, max: 29, precision: 0.01 }),
    colors:
      (setIndex === 1 && PRODUCT_COLOR.slice(0, 2)) ||
      (setIndex === 2 && PRODUCT_COLOR.slice(1, 3)) ||
      (setIndex === 3 && PRODUCT_COLOR.slice(2, 4)) ||
      (setIndex === 4 && PRODUCT_COLOR.slice(3, 6)) ||
      (setIndex === 23 && PRODUCT_COLOR.slice(4, 6)) ||
      (setIndex === 24 && PRODUCT_COLOR.slice(5, 6)) ||
      PRODUCT_COLOR,
    status: sample(['sale', 'new', '', '']),
  };
});

export default products;
