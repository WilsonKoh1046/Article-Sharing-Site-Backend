const { QueryTypes } = require("sequelize");
const { Posts, sequelize } = require("../models/Posts");

/*
content genres:
'comedy', 'horror', 'romantic', 'fiction', 'thriller', 'family', 'gaming', 'lifestyle', 'knowledge'
*/

class PostsServices {

    constructor() {};

    async _checkIfBelong(post_id, email) {
        try {
            let check = await sequelize.query(
                `select * from posts p
                inner join users u
                on p.user_id = u.id
                where p.user_id = ${post_id}
                and u.email = '${email}'`,
                {type: QueryTypes.SELECT} 
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
            let output = await sequelize.query(
                `select 
                    case 
                        when (select count(*) from posts where (${personal_id} = any(${action})) and id = ${target_id}) = 0 then 'NO'
                        else 'YES'
                    end
                from posts
                where id = ${target_id}`,
                {type: QueryTypes.SELECT}
                );
            return output[0].case === 'NO';
        } catch(err) {
            console.log(err);
        }
    }

    async _checkOppositeVote(personal_id, target_id, action) {
        let oppAction = this._convertVoteAction(action);
        try {
            let output = await sequelize.query(
                `select
                    case 
                        when (select count(*) from posts where (${personal_id} = any(${oppAction})) and id = ${target_id}) = 0 then 'NO'
                        else 'YES'
                    end
                from posts
                where id = ${target_id}`,
                {type: QueryTypes.SELECT}
                );
            return output[0].case === 'NO';
        } catch(err) {
            console.log(err);
        }
    }

    async createPost(title, content, content_genre, user_id) {
        try {
            let post = await Posts.create({
                title: title,
                content: content,
                content_genre: content_genre,
                user_id: user_id
            })
            return {"Status": 201, "Message": post};
        } catch(err) {
            console.log(err);
        }
    }

    async getAllPosts() {
        try {
            let posts = await sequelize.query(
                `select p.title, p.content, p.content_genre, p.upvote, p.downvote, p.created_date, u.name from posts p
                left join users u
                on p.user_id = u.id
                `, 
                {type: QueryTypes.SELECT});
            return {"Status": 200, "Data": posts};
        } catch(err) {
            console.log(err);
        }
    }

    async getPostById(id, email) {
        try {
            if (!this._checkIfBelong(id, email)) {
                return {"Status": 401, "Message": "Item not found"};
            }
            let post = await Posts.findOne({
                where: {
                    id: id
                }
            });
            return {"Status": 200, "Data": post};
        } catch(err) {
            console.log(err);
        }
    } 

    async getAllMyPosts(id) {
        try {
            let posts = await Posts.findAll({
                where: {
                    user_id: id
                }
            });
            return {"Status": 200, "Data": posts};
        } catch(err) {
            console.log(err);
        }
    }

    async updatePost(id, title, content, content_genre, email) {
        try {
            if (!this._checkIfBelong(id, email)) {
                return {"Status": 401, "Message": "Item not found"};
            }
            let post = await Posts.update({
                title: title,
                content: content,
                content_genre: content_genre
            }, {
                where: {
                    id: id    
                }
            })
            return {"Status": 200, "Data": post};
        } catch(err) {
            console.log(err);
        }
    }

    async deletePost(id, email) {
        try {
            if (!this._checkIfBelong(id, email)) {
                return {"Status": 401, "Message": "Item not found"};
            }
            let post = await Posts.destroy({
                id: id
            });
            return {"Status": 202, "Data": post};
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
                await sequelize.query(
                    `update posts
                    set ${oppAction} = array_remove(${oppAction}, ${personal_id})
                    where id = ${target_id}`,
                    {type: QueryTypes.UPDATE}
                    );
            }
            await sequelize.query(
                `update posts
                set ${action} = array_append(${action}, ${personal_id})
                where id = ${target_id}
                returning array_length(${action}, 1)`,
                {type: QueryTypes.UPDATE}
                );
            return {
                "Status": 201, 
                "Message": `User ${personal_id} ${action}d post ${target_id}`
            };
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = new PostsServices();