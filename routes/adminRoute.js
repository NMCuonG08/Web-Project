import { Router } from 'express';
import adminService from '../service/adminService.js';
import categoryService from '../service/categoryService.js';
import articleService from '../service/articleService.js';

const router = Router();

router.get('/categories', async (req, res) => {
    const list = await categoryService.getAll();
    res.render('admin/categories', {
        list: list,
        layout: "nav-bar-admin"
    });
});

router.post('/categories/add', async (req, res) => {
    const { name, description, slug } = req.body;

    try {
        const ret = await categoryService.add(name, description, slug);
        if (ret) {
            res.redirect('/admin/categories');
        } else {
            res.status(500).send('Error when adding category.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred.');
    }
});

router.get('/categories/add', (req, res) => {
    res.render('admin/addcat.hbs', {
        layout: "nav-bar-admin"
    });
});

router.post('/categories/delete/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const ret = await categoryService.del(id);
        if (ret) {
            res.redirect('/admin/categories');
        } else {
            res.status(500).send('Error when deleting category.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred.');
    }
});

router.post('/categories/edit/:id', async (req, res) => {
    const { id } = req.params;
    const updatedCategory = req.body;

    try {
        const ret = await categoryService.patch(id, updatedCategory);
        if (ret) {
            res.redirect('/admin/categories');
        } else {
            res.status(500).send('Error when editing category.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred.');
    }
});
router.get('/categories/edit/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the category by ID
        const category = await categoryService.findById(id);

        if (category) {
            res.render('admin/editcat.hbs', {
                layout: "nav-bar-admin",
                category, // Pass category data to the template
            });
        } else {
            res.status(404).send('Category not found.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred while retrieving the category.');
    }
});
// Tags
router.get('/tags', async (req, res) => {
    const list = await adminService.getTags();
    res.render('admin/tags', {
        list: list,
        layout: "nav-bar-admin"
    });
});

router.post('/tags/add', async (req, res) => {
    const { name, slug } = req.body;

    try {
        const ret = await db('tag').insert({
            name,
            slug,
            created_at: new Date(),
            updated_at: new Date(),
            status: 1
        });
        if (ret) {
            res.redirect('/admin/tags');
        } else {
            res.status(500).send('Error when adding tag.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred.');
    }
});

router.post('/tags/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ret = await adminService.delTag(id);
        if (ret) {
            res.redirect('/admin/tags');
        } else {
            res.status(500).send('Error when deleting tag.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred.');
    }
});

router.post('/tags/edit/:id', async (req, res) => {
    const { id } = req.params;
    const updatedTag = req.body;

    try {
        const ret = await adminService.patchTag(id, updatedTag);
        if (ret) {
            res.redirect('/admin/tags');
        } else {
            res.status(500).send('Error when editing tag.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred.');
    }
});

// Users
router.get('/users', async (req, res) => {
    const list = await adminService.getAllUsers();
    res.render('admin/users', {
        list: list,
        layout: "nav-bar-admin"
    });
});

router.post('/users/add', async (req, res) => {
    const { FullName, Email, Firstname, LastName } = req.body;

    try {
        const ret = await db('userinfo').insert({
            FullName,
            Email,
            Firstname,
            LastName
        });
        if (ret) {
            res.redirect('/admin/users');
        } else {
            res.status(500).send('Error when adding user.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred.');
    }
});

router.post('/users/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ret = await adminService.delUser(id);
        if (ret) {
            res.redirect('/admin/users');
        } else {
            res.status(500).send('Error when deleting user.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred.');
    }
});

router.post('/users/edit/:id', async (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    try {
        const ret = await adminService.patchUser(id, updatedUser);
        if (ret) {
            res.redirect('/admin/users');
        } else {
            res.status(500).send('Error when editing user.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred.');
    }
});

router.get('/articles', async (req, res) => {
    try {
        const list = await articleService.getArticle(); // Retrieves all articles
        res.render('admin/articles', {
            list: list,
            layout: "nav-bar-admin"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred while retrieving articles.');
    }
});

// Add Article
router.post('/articles/add', async (req, res) => {
    const { title, content, summary, status } = req.body;

    try {
        const addDate = new Date();
        const ret = await db('articles').insert({
            title,
            content,
            summary,
            status: status || 'draft', // Default to 'draft' if status is not provided
            created_at: addDate,
            updated_at: addDate
        });
        if (ret) {
            res.redirect('/admin/articles');
        } else {
            res.status(500).send('Error when adding article.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred while adding the article.');
    }
});

// Add Article Form
router.get('/articles/add', (req, res) => {
    res.render('admin/addarticle.hbs', {
        layout: "nav-bar-admin"
    });
});

// Delete Article
router.post('/articles/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ret = await articleService.del(id);
        if (ret) {
            res.redirect('/admin/articles');
        } else {
            res.status(500).send('Error when deleting article.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred while deleting the article.');
    }
});

// Edit Article
router.post('/articles/edit/:id', async (req, res) => {
    const { id } = req.params;
    const updatedArticle = req.body;

    try {
        const ret = await articleService.patch(id, updatedArticle);
        if (ret) {
            res.redirect('/admin/articles');
        } else {
            res.status(500).send('Error when editing article.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred while editing the article.');
    }
});

// View Single Article by ID
router.get('/articles/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const article = await articleService.getArticleByID(id);
        if (article) {
            res.render('admin/viewarticle.hbs', {
                article: article,
                layout: "nav-bar-admin"
            });
        } else {
            res.status(404).send('Article not found.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred while retrieving the article.');
    }
});

export default router;