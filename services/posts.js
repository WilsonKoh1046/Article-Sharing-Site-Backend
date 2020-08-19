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

    _convertVoteAction(action) {
        return action === 'downvote' ? 'upvote' : 'downvote';
    }

    async _checkIfClicked(personal_id, target_id, action) {
        try {
            let output = await this._DB.query(
                `select 
                    case 
                        when (select count(*) from posts where (${personal_id} = any(${action})) and id = ${target_id}) = 0 then 'NO'
                        else 'YES'
                    end
                from posts
                where id = ${target_id}`
                );
            return output.rows[0].case === 'NO';
        } catch(err) {
            console.log(err);
        }
    }

    async _checkOppositeVote(personal_id, target_id, action) {
        let oppAction = this._convertVoteAction(action);
        try {
            let output = await this._DB.query(
                `select
                    case 
                        when (select count(*) from posts where (${personal_id} = any(${oppAction})) and id = ${target_id}) = 0 then 'NO'
                        else 'YES'
                    end
                from posts
                where id = ${target_id}`
                );
            return output.rows[0].case === 'NO';
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
                `select p.title, p.content, p.content_genre, p.upvote, p.downvote, p.created_date, u.name from posts p
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

    async vote(personal_id, target_id, action) {
        try {
            let check1 = await this._checkIfClicked(personal_id, target_id, action);
            if (check1 === false) {
                return {"Status": 403, "Message": `Error, user ${personal_id} already ${action}d post ${target_id}`};
            }
            let oppAction = this._convertVoteAction(action);
            let check2 = await this._checkOppositeVote(personal_id, target_id, action);
            // Remove the vote at the opposite if a vote was casted
            if (check2 === false) {
                await this._DB.query(
                    `update posts
                    set ${oppAction} = array_remove(${oppAction}, ${personal_id})
                    where id = ${target_id}`
                    );
            }
            let statement = await this._DB.query(
                `update posts
                set ${action} = array_append(${action}, ${personal_id})
                where id = ${target_id}
                returning array_length(${action}, 1)`
                );
            return {
                "Status": 201, 
                "Message": `User ${personal_id} ${action}d post ${target_id}, ${action} count: ${statement.rows[0].array_length}`
            };
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = new Posts();