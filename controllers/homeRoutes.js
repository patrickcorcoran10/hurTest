const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const isAuth = require('../utils/auth')

// Get all posts and join with user data
router.get('/', async (req, res) => {
    try{
        const postData = await Post.findAll({
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'text', 'date_created', 'user_id', 'post_id'],
                    include: {
                        model: User,
                        attributes: ['name'],
                    }
                },
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    };
});

// Route to single post
router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ['name']
                    },
                },
            ],
        });

        const post = postData.get({ plain: true });

        res.render('post', {
            ...post,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    };
});

// Route to sign in
router.get('/signin', async (req, res) =>{
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    } else {
        res.render('signin');
    };
});

// Route to sign up
router.get('/signup', async (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    } else {
        res.render('signup');
    };
});

// Route to dashboard
router.get('/dashboard', isAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Post },
                { 
                    model: Comment,
                    include: {
                        model: Post,
                        attributes: ['title'],
                    },
                },
            ],
        });

        const user = userData.get({ plain: true });

        res.render('dashboard', {
            ...user,
            logged_in: true,
        });
    } catch (err) {
        res.status(500).json(err);
    };
});

router.get('/newpost', async (req, res) => {
        if (req.session.logged_in) {
            res.render('newpost');
        } else {
            res.redirect('/');
        };
})

router.get('/editpost/:id', isAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id);

        const post = postData.get({ plain: true });

        res.render('editpost',{
            post,
            logged_in: true,
        });
    } catch {
        res.status(500).json(err);
    };
});

module.exports = router;