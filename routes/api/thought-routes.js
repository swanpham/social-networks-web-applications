const router = require( 'express' ).Router();
const {
    getThoughts,
    addThought,
    getThoughtId,
    updateThought,
    deleteThought

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

module.exports = router;