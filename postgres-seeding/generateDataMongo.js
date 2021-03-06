var mongoose = require('mongoose');
const { restaurants } = require('./mongoSchema.js')
const faker = require('faker');
const fs = require('fs');
require('events').EventEmitter.prototype._maxListeners = 1000;

function getRandomMenuItems() {
  let result = {};
  const randomNum = faker.random.number({'min': 0,'max': 3});
  for (let i = 0; i < randomNum; i++) {
    result[faker.random.number({'min': 1,'max': 5})] = '';
  }
  return Object.keys(result);
}
var allReviews = [];
for (let j = 0; j < 1000; j++) {
  var review = {};
  review['user_name'] = faker.name.findName();
  review['content'] = faker.lorem.sentences();
  review['order_items'] = getRandomMenuItems();
  review['rating'] = faker.random.number({'min': 1,'max': 5});
  review['delivery_rating'] = faker.random.number({'min': 1,'max': 5});
  review['order_rating'] = faker.random.number({'min': 1,'max': 5});
  review['update_date'] = faker.date.between('2018-01-01', '2019-01-01').toLocaleDateString('en-US');
  // tsv += id++ + '\t' + faker.name.findName() + '\t' + restaurant_id + '\t' + faker.lorem.sentences() + '\t' +
  //       getRandomMenuItems() + '\t' + faker.random.number({'min': 1,'max': 5}) + '\t' +
  //       faker.random.number({'min': 1,'max': 5}) + '\t' + faker.random.number({'min': 1,'max': 5}) + '\t' + 
  //       faker.date.between('2018-01-01', '2019-01-01').toLocaleDateString('en-US') + '\r\n';
  allReviews.push(review);
}

var count = 0;
async function seed1000Reviews(batchNum, restaurantNum, reviewNum) {
  for (let k = 0; k < batchNum; k++) {
    var batch = [];
    for (let i = 0; i < restaurantNum; i++) {
      console.log(count);
      var restaurant = {
        id: count++,
        restaurant_name: faker.company.companyName(),
      }
      var reviews = [];
      for (j = 0; j < reviewNum; j++) {
        reviews.push(allReviews[Math.floor(Math.random() * 1000)]);
      }
      restaurant['reviews'] = reviews;
      batch.push(restaurant);
    }
    await restaurants.insertMany(batch);
  } 
}

async function timeSeed () {
  var before = Date.now();
  await seed1000Reviews(200, 25, 1000); //5,000
  await seed1000Reviews(200, 250, 100); //50,000
  await seed1000Reviews(200, 2500, 10); //500,000
  await seed1000Reviews(400, 5000, 5); // 2,000,000
  await seed1000Reviews(1000, 5000, 1); // 5,000,000
  await seed1000Reviews(500, 5000, 0); //2,500,000
  var after = Date.now();
  console.log(`MongoDB seeding finished in ${(after - before) / 60000} minutes!`)
} 

timeSeed();
