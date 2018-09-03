var mongoose = require('mongoose');
var Schema = mongoose.Schema({
    img: String,
    brand: Boolean,
    name: String,
    grade: String,
    monthlySales: String,
    hummingbirdDelivery: Boolean,
    minOrderPrice: String,
    deliveryPrice: String,
    distance: String,
    time: String,
    label: Array,
    firstOrder: String,
    discount: String,
    eventNumber: String,
    event: Array
});

module.exports = mongoose.model('shop', Schema);