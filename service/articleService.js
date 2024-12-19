import db from '../utils/db.js';
import pdf from 'html-pdf';
import htmlPdfNode from 'html-pdf-node';
import fs from 'fs';

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
    async getArticleByPre(pre) {
        return db('articles').where('is_premium',pre);
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
    },
    async updateStatusToPublished(id) {
        try {
            const article = await db('articles').where('id', id).first();

            if (!article) {
                throw new Error('Article not found');
            }

            return db('articles')
                .where('id', id)
                .update({ status: 'published' });
        } catch (error) {
            console.error('Error updating article status to published:', error);
            throw error;
        }
    },
    async getArticleContentById(id) {
        try {
            const article = await db('articles').where('id', id).first();
            if (!article) {
                throw new Error('Article not found');
            }
            return article.content; // Assuming content contains HTML data
        } catch (error) {
            console.error('Error fetching article content:', error);
            throw error;
        }
    },

    async generatePdfFromHtml(htmlContent, outputPath) {
        try {
            const file = { content: htmlContent };
            const options = { format: 'A4' };

            await htmlPdfNode.generatePdf(file, options).then((pdfBuffer) => {
                fs.writeFileSync(outputPath, pdfBuffer);
            });

            return outputPath;
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    }
}