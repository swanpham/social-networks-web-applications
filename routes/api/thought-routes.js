const router = require( 'express' ).Router();
const {
    getThoughts,
    addThought,
    getThoughtId,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction

} = require ('../../controllers/thought-controller');

router
.route('/')
.get(getThoughts)
.post(addThought)

router
.route('/:id')
.get(getThoughtId)
.put(updateThought)
.delete(deleteThought)

router
.route('/:id/reaction')
.put(addReaction)

router
.route('/:id/reaction/:reactionId')
.delete(deleteReaction);


module.exports = router;