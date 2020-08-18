const pool = require("../config/database");

/*
content genres:
'comedy', 'horror', 'romantic', 'fiction', 'thriller', 'family', 'gaming', 'lifestyle', 'knowledge'
*/

class Posts {

    constructor() {
        this._DB = pool;
    }

    async _checkIfBelong(post_id, email) {
        try {
            let check = await this._DB.query(
                `select * from posts p
                inner join users u
                on p.user_id = u.id
                where p.user_id = ${post_id}
                and u.email = '${email}'`
                );
            return check.rows.length > 0;
        } catch(err) {
            console.log(err);
        }
    }

    async createPost(title, content, content_genre, user_id, email) {
        try {
            let post = await this._DB.query(
                `insert into posts (title, content, content_genre, user_id, created_date)
                values ('${title}', '${content}', '${content_genre}', '${user_id}', current_timestamp)
                returning *`
                );
            return {"Status": 201, "Message": post.rows[0]};
        } catch(err) {
            console.log(err);
        }
    }

    async getAllPosts() {
        try {
            let posts = await this._DB.query(
                `select p.title, p.content, p.content_genre, p.created_date, u.name from posts p
                left join users u
                on p.user_id = u.id
                `);
            return {"Status": 200, "Data": posts.rows};
        } catch(err) {
            console.log(err);
        }
    }

    async getPostById(id, email) {
        try {
            if (!this._checkIfBelong(id, email)) {
                return {"Status": 401, "Message": "Item not found"};
            }
            let post = await this._DB.query(
                `select * from posts
                where id = ${id}`
                );
            return {"Status": 200, "Data": post.rows[0]};
        } catch(err) {
            console.log(err);
        }
    } 

    async getAllMyPosts(id) {
        try {
            let posts = await this._DB.query(
                `select * from posts
                where user_id = ${id}`
                );
            return {"Status": 200, "Data": posts.rows};
        } catch(err) {
            console.log(err);
        }
    }

    async updatePost(id, title, content, content_genre, email) {
        try {
            if (!this._checkIfBelong(id, email)) {
                return {"Status": 401, "Message": "Item not found"};
            }
            let post = await this._DB.query(
                `update posts
                set title = '${title}',
                content = '${content}',
                content_genre = '${content_genre}'
                where id = ${id}
                returning *`
                );
            return {"Status": 200, "Data": post.rows[0]};
        } catch(err) {
            console.log(err);
        }
    }

    async deletePost(id, email) {
        try {
            if (!this._checkIfBelong(id, email)) {
                return {"Status": 401, "Message": "Item not found"};
            }
            let post = await this._DB.query(
                `delete from posts
                where id = ${id}
                returning *`
                );
            return {"Status": 202, "Data": post.rows[0]};
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = new Posts();