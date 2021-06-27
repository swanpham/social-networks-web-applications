const {User, Thought} = require ('../models');

const thoughtcontroller = {
    getThoughts( req, res ) {
        Thought.find( {} )
        .then( dbThoughtData => res.json( dbThoughtData ) )
        .catch( err => res.status( 400 ).json( err ) )
    },
    addThought( { body }, res ){
        Thought.create( body )
        .then( dbThoughtData => {
            User.findOneAndUpdate(
                { username: body.username },
                { $push: { thoughts: dbThoughtData.id } },
                { new: true, runValidators: true }
            )
            .then( dbUserData => {
                if( !dbUserData ){
                    res.status( 404 ).json( { message: 'No user found with this id!' } )
                    return
                }
                res.json( dbUserData )
            } )
            .catch( err => res.status( 400 ).json( err ) ) 
        })
        .catch( err => res.status( 400 ).json( err ) )
    },
    getThoughtId( { params }, res ) {
        Thought.findById( params.id )
        .then( dbThoughtData => res.json( dbThoughtData ) )
        .catch( err => res.status( 400 ).json( err ) )
    },
    updateThought( { body, params }, res ){
        Thought.findByIdAndUpdate(
            params.id,
            body, 
            { 
                new: true, 
                runValidators: true 
            } 
        )
        .then( dbThoughtData => {
            if( !dbThoughtData ){
                res.status( 404 ).json( { message: 'No thought found with this id!' } )
                return
            }
            res.json( dbThoughtData )
        } )
        .catch( err => res.status( 400 ).json( err ) )
    },
    deleteThought( { params }, res ){
        Thought.findByIdAndDelete(
            params.id
        )
        .then( dbThoughtData => {
            if( !dbThoughtData ){
                res.status( 404 ).json( { message: 'No thought found with this id!' } )
                return
            }
            User.findOneAndUpdate(
                { username: dbThoughtData.username },
                { $pull: { thoughts: dbThoughtData.id } },
                { new: true }
            )
            .then( dbUserData => {
                if( !dbUserData ){
                    res.status( 404 ).json( { message: 'No user found with this id!' } )
                    return
                }
                res.json( dbThoughtData )
            } )
            .catch( err => res.status( 400 ).json( err ) ) 
        } )
        .catch( err => res.status( 400 ).json( err ) )
    },
    addReaction( { params, body }, res ){
        Thought.findByIdAndUpdate(
            params.id,
            { $push: { reactions: body } },
            { 
                new: true, 
                runValidators: true 
            }
        )
        .then( dbThoughtData => {
            if( !dbThoughtData ){
                res.status( 404 ).json( { message: 'No thought found with this id!' } )
                return
            }
            res.json( dbThoughtData )
        } )
        .catch( err => res.status( 400 ).json( err ) )
    },
    deleteReaction( { params }, res ){
        Thought.findByIdAndUpdate(
            params.id,
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { 
                new: true
            }
        )
        .then( dbThoughtData => {
            if( !dbThoughtData ){
                res.status( 404 ).json( { message: 'No thought found with this id!' } )
                return
            }
            res.json( dbThoughtData )
        } )
        .catch( err => res.status( 400 ).json( err ) )
    }

}

module.exports = thoughtcontroller;
