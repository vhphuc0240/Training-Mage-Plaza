import * as fs from 'fs';

const getData = (url) => {
    try {
        return fetch(url).then(response => response.json())
    } catch (e) {
        console.error(e)
    }
};


const formatData = async () => {
    const [users, posts, comments] = await Promise.all([getData('https://jsonplaceholder.typicode.com/users'), getData('https://jsonplaceholder.typicode.com/posts'), getData('https://jsonplaceholder.typicode.com/comments'),]);
    return users
        .map(user => {
            const userPosts = posts.filter(post => post.userId === user.id).map(post => {
                const {userId, ...rest} = post;
                return rest;
            })
            const userComments = userPosts.map(post => {
                return comments.filter(comment => post?.id === comment.postId);
            })
            return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                posts: userPosts,
                comments: userComments.flat(),
            }
        });
}
const filterUserWithMoreThan3Comments = (data) => {
    return data.filter(user => user.comments.length >= 3)
}
const reformatWithCount = (data) => {
    return data.map(user => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        commentsCount: user.comments.length,
        postsCount: user.posts.length,
    }))
}

const sortByPostDesc = (data) => {
    return data.sort((a, b) => Number(b.postsCount) - Number(a.postsCount))
}
const getPostDataWithID = async (id) => {
    try {
        const [post, comments] = await Promise.all([getData(`https://jsonplaceholder.typicode.com/posts/${id}`), getData(`https://jsonplaceholder.typicode.com/comments?postId=${id}`)]);
        return {...post, comments};
    } catch (e) {
        console.error(e)
    }
}

(async () => {
    const formattedData = await formatData();
    fs.writeFileSync('./step3.json', JSON.stringify(formattedData))
    fs.writeFileSync('./step4.json', JSON.stringify(filterUserWithMoreThan3Comments(formattedData)))
    const reformattedUsers = reformatWithCount(formattedData);
    fs.writeFileSync('./step5.json', JSON.stringify(reformattedUsers));
    const mostComment = reformattedUsers.reduce((prev, current) => (prev.commentsCount > current.commentsCount) ? prev : current);
    const mostPost = reformattedUsers.reduce((prev, current) => (prev.postsCount > current.postsCount) ? prev : current);
    fs.writeFileSync('./step7.json', JSON.stringify(sortByPostDesc(reformattedUsers)));
    const postDataWithID = await getPostDataWithID(1);
    fs.writeFileSync('./step8.json', JSON.stringify(postDataWithID));
})()
