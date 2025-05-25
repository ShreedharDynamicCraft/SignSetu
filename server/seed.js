require('dotenv').config();
const mongoose = require('mongoose');
const Word = require('./models/Word');

const demoWords = [
  {
    word: "Namaste",
    definition: "A traditional Indian greeting, showing respect by joining palms together in front of the chest.",
    imageUrl: "https://images.unsplash.com/photo-1576867277899-9d790876ca5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    videoUrl: "https://www.youtube.com/embed/HcQ7dNWmJQc",
  },
  {
    word: "Diwali",
    definition: "The Festival of Lights, one of the most significant festivals in Indian culture symbolizing the victory of light over darkness.",
    imageUrl: "https://images.unsplash.com/photo-1604423439387-36e829b2aa81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2002&q=80",
    videoUrl: "https://www.youtube.com/embed/byLO0U_tV_A",
  },
  {
    word: "Cricket",
    definition: "A bat-and-ball game that is extremely popular in India, often referred to as a religion rather than just a sport.",
    imageUrl: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    videoUrl: "https://www.youtube.com/embed/wrMcpeACozM",
  },
  {
    word: "Yoga",
    definition: "An ancient physical, mental and spiritual practice that originated in India, aiming at body-mind harmony.",
    imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    videoUrl: "https://www.youtube.com/embed/19P9MdCG_nY",
  },
  {
    word: "Chai",
    definition: "A sweetened blend of tea and spices with milk, integral to Indian culture and hospitality.",
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    videoUrl: "https://www.youtube.com/embed/4-QsQeVIcIw",
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => console.log('MongoDB connected for seeding'))
      .catch(err => console.log('MongoDB connection error:', err));

    // Delete existing data
    await Word.deleteMany({});
    console.log('Cleared existing words');

    // Insert demo words
    await Word.insertMany(demoWords);
    console.log('Successfully seeded demo words with Indian context');
    
    // Disconnect from MongoDB
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
