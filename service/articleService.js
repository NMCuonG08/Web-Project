import db from '../utils/db.js';

export default {
    async getArticlesByWriterID(userID){

        const list = await db('writer_article').where('writer_id', userID)
        
        const articleIds = list.map(item => item.article_id);

        return db('articles').whereIn('id', articleIds);
    },

    async getArticleByID(id) {
        return db('articles').where('id', id).first();
    },
    async getArticle() {
        return db('articles');
    },
    async del(id){
        return db("articles").where("id", id).del();
    },
 
    async patch(id,category){
        return db("articles").where("id", id).update(category);
    },
    async updateStatusToDraft(id) {
        try {
            const article = await db('articles').where('id', id).first();

            if (!article) {
                throw new Error('Article not found');
            }

            return db('articles')
                .where('id', id)
                .update({ status: 'draft' });
        } catch (error) {
            console.error('Error updating article status to draft:', error);
            throw error;
        }
    }
}