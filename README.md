# MERN Stack: Novice to Ninja
A step-by-step tutorial to learn how to create your own app using the MERN stack

## Step 1: A taste of success

In step 1, we create a simple Hello World app, host it on a server using
node and express. We use react and react transoformers off a CDN, so the
amount of code in the repo is very minimal. We are yet to hook it to
Mongo or any other backend, the first few steps are aimed at learning
React more than anything else.

## Step 2: React the right way

In the previous step, we used a JSX transformer in the browser. This approach is
inefficient. In this step, we will move the transformation to build time. The two
popular task-running tools are grunt and gulp. Here, we use gulp. 

In this step, we will use gulp to only transform JSX, later, we will use gulp for
automating other tasks as well.

Thanks to [this](http://tylermcginnis.com/reactjs-tutorial-pt-2-building-react-applications-with-gulp-and-browserify/) blogpost.

Additional installs for this step:
$ npm install --global gulp

## Step 3: Gulp Watch

Here, we add a watch task to gulp so that when changes to App.js are saved, it
automatically transforms it. Convenient during development.

## Step 4: Compose React Components

Now, we replace the simple React code with a composed component, and use data
to populate the contents. This a kind of for-loop implementation.

## Step 5: Use state instead of props

The correct way to use data is by using the state, not props. In this step, we
make the transition to state.

## Step 6: Dynamic Updates

What use of state if we can't update it? Here, we update the state and add
more data dynamically, on user interaction.

## Step 7: Data on the Server

Instead of keeping 'fake' data on the client, we'll now get from and send the data
to the server, but not use MongoDB yet.

## Step 8: Data on MongoDB

In this step, we move the data to MongoDB from the in-memory store.

## Step 9: Filtering

Rather than fetch all the records from the server, we'll add a convenience filter
that fetches us a set of records based on an input query filter.

## Step 9: Use Browserify

Use Browserify to build and bundle client side scripts into one bundle. Now,
all dependencies are part of package.json, and this includes client-side scripts.

## Step 10: Routing

Add routing: this includes navigation to other components and also handling
options and parameters for each route.


