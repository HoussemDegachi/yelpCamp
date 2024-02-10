const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp")

const Campground = require("../models/campground")
const cities = require("./cities")
const { descriptors, places } = require("./seedHelpers")
const db = mongoose.connection

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seedDb = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        console.log("saving", i)
        const newCamp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dqu4adqkj/image/upload/v1707382154/Yelpcamp/qlbfreumnohvwaoytehb.jpg',        
                  filename: 'Yelpcamp/qlbfreumnohvwaoytehb',
                },
                {
                  url: 'https://res.cloudinary.com/dqu4adqkj/image/upload/v1707382192/Yelpcamp/iyy2zerlhdai12ew022t.jpg',        
                  filename: 'Yelpcamp/iyy2zerlhdai12ew022t',
                }
              ],
            author: "65c31f8faf76a6f2ef665a4f",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis ipsum, libero, corrupti sit repellendus quae illum similique beatae dignissimos eveniet quam! Reiciendis repellat fugiat atque cumque eligendi, repellendus modi ipsum.",
            price: Math.floor(Math.random() * 20) + 10
        })
        await newCamp.save()
        console.log(i, "saved succesfully")
    }
}

seedDb().then(() => {
    db.close()
    console.log("success")
})