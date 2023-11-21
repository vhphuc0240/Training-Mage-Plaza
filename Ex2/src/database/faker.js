import { faker } from "@faker-js/faker";
import fs from "fs";

const generateFakeData = () => {
  const fakeData = [];
  for (let i = 0; i < 100; i++) {
    fakeData.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      color: faker.color.rgb(),
      product: faker.commerce.department(),
      description: faker.commerce.productDescription(),
      image: faker.image.url(),
      createdAt: faker.date.past(),
    });
  }
  return fakeData;
};

const writeFakeData = () => {
  const fakeData = generateFakeData();
  fs.writeFileSync(__dirname + "/products.json", JSON.stringify(fakeData));
};

writeFakeData();
