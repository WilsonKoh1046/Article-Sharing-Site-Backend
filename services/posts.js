const db = require("../config/database");
const pool = db.pool;

/*
content genres:
'comedy', 'horror', 'romantic', 'fiction', 'thriller', 'family', 'gaming', 'lifestyle', 'knowledge'
*/

const getAllPosts = async () => {
    try {
        let result = await pool.query('select * from posts');
        return result.rows;
    } catch (err) {
        console.log(err);
    }
}

const getOnePost = async (id) => {
    try {
        let result = await pool.query('select * from posts where id = $1', [id]);
        return result.rows;
    } catch (err) {
        console.log(err);
    }
}

const createPost = async (name, title, content, content_genre) => {
    try {
        await pool.query(
            'insert into posts (name, title, content, date, content_genre) values ($1, $2, $3, current_timestamp, $4)', 
        [name, title, content, content_genre]
        );
    } catch (err) {
        console.log(err);
    }
}

const updatePost = async (id, name, title, content, content_genre) => {
    try {
        await pool.query(
            'update posts set name = $1, title = $2, content = $3, date = current_timestamp, content_genre = $5 where id = $4', 
        [name, title, content, id, content_genre]
        );
    } catch(err) {
        console.log(err);
    }
}

const deletePost = async (id) => {
    try {
        await pool.query('delete from posts where id = $1', [id]);
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    getAllPosts,
    getOnePost,
    createPost,
    updatePost,
    deletePost
}