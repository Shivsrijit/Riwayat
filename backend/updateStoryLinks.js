const mongoose = require('mongoose');
require('dotenv').config();
const FeaturedStory = require('./models/FeaturedStory');

const storyLinks = [
  {
    title: "The Last Weavers of Varanasi",
    link: "https://www.nationalgeographic.com/history/article/banarasi-silk-weaving-india"
  },
  {
    title: "Kathakali: Dance of the Gods",
    link: "https://www.keralatourism.org/artforms/kathakali/2"
  },
  {
    title: "The Spice Routes of Malabar",
    link: "https://www.britannica.com/place/Malabar-Coast"
  },
  {
    title: "Warli Art: Tribal Tales on Walls",
    link: "https://www.culturalindia.net/indian-art/paintings/warli-paintings.html"
  },
  {
    title: "Bihu: The Festival of Assam",
    link: "https://www.assaminfo.com/festivals/1/bihu.htm"
  }
];

async function updateStoryLinks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const storyLink of storyLinks) {
      const result = await FeaturedStory.updateOne(
        { title: storyLink.title },
        { $set: { link: storyLink.link } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`Updated link for: ${storyLink.title}`);
      } else {
        console.log(`No story found with title: ${storyLink.title}`);
      }
    }

    console.log('Story links update completed!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error updating story links:', error);
    mongoose.disconnect();
  }
}

updateStoryLinks(); 