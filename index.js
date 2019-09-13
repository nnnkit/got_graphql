const { GraphQLServer } = require('graphql-yoga');
const posts = [];
let postIds = 0;
const resolvers = {
  Query: {
    posts: () => posts,
  },
  Mutation: {
    createDraft: (parent, args) => {
      const post = {
        id: `post_${postIds++}`,
        title: args.title,
        content: args.content,
        comments: [],
        author: {
          id: `author_${new Date().getMilliseconds()}`,
          name: args.author,
        },
        published: false,
      };
      posts.push(post);
      return post;
    },
    addComment: (parent, args) => {
      posts.forEach(post => {
        if (post.id === args.id) {
          const comment = {
            id: `comment_${new Date().getMilliseconds()}`,
            content: args.content,
          };
          post.comments.push(comment);
        }
      });
      return args.id;
    },
    publish: (parent, args) => {
      const postIndex = posts.findIndex(post => post.id === args.id);
      posts[postIndex].published = true;
      return posts[postIndex];
    },
  },
};
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

server.start(
  {
    port: 5577,
    endpoint: '/graphql',
    playground: '/playground',
  },
  () => {
    console.log(
      `Your graphql playground is running at http://localhost:5577/playground`,
    );
    console.log(
      `Your graphql server is running at http://localhost:5577/graphql`,
    );
  },
);
