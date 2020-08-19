CREATE TYPE genre AS ENUM
    ('comedy', 'horror', 'romantic', 'fiction', 'thriller', 'family', 'gaming', 'lifestyle', 'knowledge');

CREATE TABLE users
(
    id serial NOT NULL,
    name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

CREATE TABLE posts
(
    id serial NOT NULL,
    title character varying(255) NOT NULL,
    content_genre genre NOT NULL,
    content text NOT NULL,
    user_id integer,
    upvote integer NOT NULL DEFAULT 0,
    downvote integer NOT NULL DEFAULT 0,
    created_date timestamp without time zone NOT NULL,
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
);