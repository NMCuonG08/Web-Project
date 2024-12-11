import db from '../utils/db.js';


export default {
    async addTag(tagData) {
        const { name, slug } = tagData;
        const addDate = Date.now();
        return db('tag').insert({
              name,
              slug,
              created_at: addDate,
              updated_at: addDate,
              status: 1,
            })
            .then(() => {
                return db("tags").select("id").orderBy("id", "desc").limit(1);
            })
        },
    async getUserByID(id) {
        return db('userinfo').where('UserID', id).first();
    },
    async getAllUsers() {
        return db('userinfo')
    },
    async getTags() {
        return db('tag')
    },
    async findTagById(id){
        return db("tag").where("id", id).first();
    },
    async delTag(id){
        return db("tag").where("id", id).del();
    }, 
    async patchTag(id,tag){
        return db("tag").where("id", id).update(tag);
    },
    async delUser(id){
        return db("userinfo").where("UserID", id).del();
    }, 
    async patchUser(id,category){
        return db("userinfo").where("UserID", id).update(category);
    },
}