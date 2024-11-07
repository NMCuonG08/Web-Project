import db from '../utils/db.js'
export default{
    findAll(){
        return db('userinfo');
    },
    add(entity) {
        return db('userinfo').insert(entity);
    },
    findByID(id){
        return db('userinfo').where('UserID', id).first()
    },
}

