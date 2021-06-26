const {User, Thought} = require ('../models');

const usercontroller = {
    getUsers( req, res ) {
        User.find( {} )
        .populate( {
            path: 'friends',
            select: '-__v'
        } )
        .populate( {
            path: 'thoughts',
            select: '-__v'
        } )
        .select( '-__v' )
        .then( dbUserData => res.json( dbUserData ) )
        .catch( err => res.status( 400 ).json( err ) )
    },
    addUser( { body }, res ){
        User.create( body )
        .then( dbUserData => res.json( dbUserData ) )
        .catch( err => res.status( 400 ).json( err ) )
    },
    getOneUser( { params }, res ) {
        User.findById( params.id )
        .populate( {
            path: 'friends',
            select: '-__v'
        } )
        .populate( {
            path: 'thoughts',
            select: '-__v'
        } )
        .select( '-__v' )
        .then( dbUserData => res.json( dbUserData ) )
        .catch( err => res.status( 400 ).json( err ) )
    },
    updateUser( { body, params }, res ){
        User.findByIdAndUpdate( 
            params.id, 
            body, 
            { 
                new: true, 
                runValidators: true 
            } 
        )
        .then( dbUserData => {
            if( !dbUserData ){
                res.status( 404 ).json( { message: 'No user found with this id!' } )
                return
            }
            res.json( dbUserData )
        } )
        .catch( err => res.status( 400 ).json( err ) )
    },
    deleteUser( { params }, res ){
        User.findByIdAndDelete( params.id )
        .then( dbUserData => {
            if( !dbUserData ){
                res.status( 404 ).json( { message: 'No user found with this id!' } )
                return
            }
            for( var i = 0; i < dbUserData.thoughts.length; i++ ){
                console.log( `deleting thought ${dbUserData.thoughts[i]}` )
                Thought.findByIdAndDelete( dbUserData.thoughts[i] )
                .then( dbThoughtData => {
                    if( !dbThoughtData ){
                        res.status( 404 ).json( { message: 'No thought found with this id!' } )
                        return
                    }
                    console.log( `thought deleted` )
                } )
                .catch( err => res.status( 400 ).json( err ) )
                } 
            res.json( 'User and thoughts removed' )
        } )
        .catch( err => res.status( 400 ).json( err ) )
    },
    addFriend( {params}, res ){
        User.findByIdAndUpdate(
            params.id,
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        ) 
        .then( dbUserData => {
            if( !dbUserData ){
                res.status( 404 ).json( { message: 'No user found with this id!' } )
                return
            }
            // confirm name of original user
            const username = dbUserData.username
            // add the original user to the friend id list as well
            User.findByIdAndUpdate(
                params.friendId,
                { $push: { friends: params.id } },
                { new: true, runValidators: true }
            ) 
            .then( dbUserData => {
                if( !dbUserData ){
                    res.status( 404 ).json( { message: 'No user found with this id!' } )
                    return
                }
                // confirm the name of the friend user
                const friend = dbUserData.username
                res.json( `${ username } and ${ friend } are now friends` )
            } )
            .catch( err => res.status( 400 ).json( err ) )
        } )
        .catch( err => res.status( 400 ).json( err ) )
    },
    removeFriend( { params }, res ){
        User.findByIdAndUpdate(
            params.id,
            { $pull: { friends: params.friendId } },
            { new: true }
        ) 
        .then( dbUserData => {
            if( !dbUserData ){
                res.status( 404 ).json( { message: 'No user found with this id!' } )
                return
            }
            // confirm name of original user
            const username = dbUserData.username
            // remove the original user from the friend id list as well
            User.findByIdAndUpdate(
                params.friendId,
                { $pull: { friends: params.id } },
                { new: true }
            ) 
            .then( dbUserData => {
                if( !dbUserData ){
                    res.status( 404 ).json( { message: 'No user found with this id!' } )
                    return
                }
                // confirm the name of the friend user
                const friend = dbUserData.username
                res.json( `${ username } and ${ friend } are no longer friends` )
            } )
            .catch( err => res.status( 400 ).json( err ) )
        } )
        .catch( err => res.status( 400 ).json( err ) )
    },
}

module.exports = usercontroller;

