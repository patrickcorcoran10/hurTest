const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// User has many posts
User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

// User has many comments
User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

// Posts belong to user
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

// Posts have many comments
Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
});

// Comments belong to Posts
Comment.belongsTo(Post, {
    foreignKey: 'post_id',
});

// Comments belong to User
Comment.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User, Post, Comment };