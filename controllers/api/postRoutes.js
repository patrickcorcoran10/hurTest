const router = require('express').Router();
const { Post } = require('../../models');
const isAuth = require('../../utils/auth');

router.post('/', isAuth, async (req, res) => {
    try{
        const postData = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        
        res.status(200).json(postData);
    } catch (err) {
        res.status(400).json(err);
    };
});

router.delete('/:id', isAuth, async (req, res) => {
    try {
        const postData = Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        };

        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    };
});

router.put('/:id', isAuth, async (req, res) => {
    try {
        const postData = await Post.update(
            {
                title: req.body.title,
                text: req.body.text,
            },
            {
                where: {
                    id: req.params.id,
                },
            },
        );

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id' });
        };

        res.status(200).json(postData);
    } catch {
        res.status(500).json(err);
    };
});

module.exports = router;