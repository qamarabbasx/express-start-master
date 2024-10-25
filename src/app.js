require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const Routes = require('./routes');
const { connectDB } = require('./config/database');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { startStandaloneServer } = require('@apollo/server/standalone');
const axios = require('axios');

const bodyParser = require('body-parser');

const app = express();
const server = new ApolloServer({
  typeDefs: `
  type User {
    id: ID!
    name: String!
    email: String!
    username: String!
  }
    type Todo
    {
    id:ID!
    title:String!
    completed:Boolean!
    user:User
    userId:ID!
    }    
    type Query
    {
    getTodos:[Todo]
    getAllUsers:[User]
    getUser(id:ID!):User
    }    
    type Mutation{    
    addTodo(title:String!):Todo!    
    updateTodo(id:ID!):Todo!    
    deleteTodo(id:ID!):Todo!
    }`,
  resolvers: {
    Todo:{
        user :async(todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
    },
    Query: {
      getTodos: async () =>
        (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
      getAllUsers: async () =>
        (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
      getUser: async (parent, { id }) =>
        (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
          .data,
    },
    Mutation: {
      addTodo: (parent, args, context, info) => {
        return {
          id: '1',
          title: args.title,
          completed: false,
        };
      },
      updateTodo: (parent, args, context, info) => {
        return {
          id: args.id,
          title: 'Updated',
          completed: true,
        };
      },
      deleteTodo: (parent, args, context, info) => {
        return {
          id: args.id,
          title: 'Deleted',
          completed: true,
        };
      },
    },
  },
  context: ({ req, res }) => ({ req, res }),
});
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(
  cors({
    origin: ['http://localhost:8000', 'https://studio.apollographql.com'],
    credentials: true,
  }),
);
app.use(compression());
//rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(helmet());
app.use(morgan('dev'));
//routes
app.use('/api', Routes);
async function startApolloServer() {
  // await server.start();
  // app.use('/graphql', expressMiddleware(server));
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log('Apollo server started at', url);
}
startApolloServer();

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});
// app.get('/playground', graphqlPlayground({ endpoint: '/graphql' }));
app.use(errorHandler);
connectDB();

module.exports = app;
