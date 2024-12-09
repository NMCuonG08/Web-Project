import db from '../utils/db.js';


export default {
    async getUserByID(id) {
        return db('userinfo').where('UserID', id).first();
    },
    async getAllUsers() {
        return db('users')
    },
    async getTags() {
        return db('tag')
    }
}