const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              userData = User.findOne({ _id: context.user._id });
              return userData;
            }
            throw new AuthenticationError('You need to be logged in!');
          }
    },

    Mutation: {
        // create user
        // addUser: async (parent, args) => {
        //     const user = await User.create(args);
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);
            console.log(user, token)
            return { token, user };
            // return user;
        },

        //  save book - update user
        saveBook: async (parent, { newBook }, context) => {
          if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
              { _id: context.user._id },
              { $push: { savedBooks: newBook }},
              { new: true }
            );
            return updatedUser;
          }
          // throw new AuthenticationError('You need to be logged in!');
        },
        // delete book - update user
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId }}},
                    { new: true }
                  );
                  return updatedUser;
            }
            throw new AuthenticationError("User is not logged in")
        },

        login: async(parent, {email, password}) => {
            // make sure the user exists
            const user = await User.findOne({ email });
    
            if (!user) {
            throw new AuthenticationError('No user with this email found!');
            }
    
            const correctPw = await user.comparePassword(password);
    
            if (!correctPw) {
            throw new AuthenticationError('Incorrect password!');
            }
    
            const token = signToken(user);
            return {token, user};
        }
    },
};

module.exports = resolvers;