'use strict';
const { CalmService } = require( '../../../system/core/CalmService' );
const autoBind = require( 'auto-bind' );

class UserService extends CalmService {
    constructor( model ) {
        super( model );
        this.model = model;
        autoBind( this );
    }


    async updatePassword( id, data ) {
        try {
            const user = await this.model.findById( id );
            user.password = data;
            await user.save();
            return { 'passwordChanged': true };
        } catch ( errors ) {
            throw errors;
        }
    }

    async updateProfile( id, data ) {
        try {
            const user = await this.model.findById( id );
            if( data.password ) {
                user.password = data.password;
            }
            user.name = data.name;
            await user.save();
            return { 'updated': true };
        } catch ( errors ) {
            throw errors;
        }
    }

    /**
     *
     * @param email : string
     * @param includePassword : boolean
     * @returns {Promise<*>}
     */
    async findByEmail( email, includePassword = false ) {
        let data;
        if ( includePassword ) {
            data = await this.model.findByEmail( email ).select( '+password' );
        } else {
            data = await this.model.findByEmail( email );
        }
        return { data };
    }
    async updateSettings( id, data ) {
        try {
            const user = await this.model.findOneAndUpdate( { userId: id }, data, { returnNewDocument: true, upsert: true } );

            return { 'updated': user };
        } catch ( errors ) {
            throw errors;
        }
    }
}

module.exports = { UserService };
