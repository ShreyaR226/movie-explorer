const mongoose = require('mongoose');

// Movie Schema
const MovieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  voteAverage: {
    type: Number,
    required: true,
  },
  posterPath: {
    type: String,
  },
  backdropPath: {
    type: String,
  },
}, {
  timestamps: true,
});

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    },
  ],
}, {
  timestamps: true,
});

const Movie = mongoose.model('Movie', MovieSchema);
const User = mongoose.model('User', UserSchema);

async function checkFavorites() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://shreya:shreya20@cluster0.4gtcoas.mongodb.net/users', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Get all users
    const users = await User.find({});
    console.log('Users:', users);
    
    // Get all movies
    const movies = await Movie.find({});
    console.log('Movies:', movies);
    
    // For each user, get their favorites
    for (const user of users) {
      console.log(`\nUser: ${user.name} (${user.email})`);
      console.log('Favorites IDs:', user.favorites);
      
      // Populate favorites
      const populatedUser = await User.findById(user._id).populate('favorites');
      console.log('Populated favorites:', populatedUser.favorites);
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

checkFavorites();