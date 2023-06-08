## Microfrontends

Split a single page application into different applications with their own code base. That is, separate a product listing page from the shopping cart page. 

We try to prevent direct communication between the applications. We use API to manage communication. That is API for Retrieving products and API for Managing Shopping Cart

### What are microfrontends?
* Divide a monolithic app into multiple, smaller apps.
* Each smaller app is responsible for a distinct feature of the product.

### Why use them?
* Multiple engineering teams can work in isolation.
* Each smaller app is easier to understand and make changes to.

Integration - How and when does the Container gets access to the source code in MFE #1 AND #2?
* There is no single perfect solution to integration.
* Many solutions, each have pros and cons.
* look at what your requirements are, then pick a solution.

### Major Categories of integration. 
* Build-Time Integration - Compile Time Integration 
    * Before: Container gets loaded in the browser, it gets access to ProductsList source code.
* Run-Time Integration - Client Side Integration
    * After: Container gets loaded in the browser, it gets access to ProductList source code.
* Server Integration
    * While sending down js to load up Container, a sever decides on whether or not to include ProductList source.

## Build-Time Integration
1. Engineering team develops ProductsList
2. Time to Deploy!
3. Publish ProductLists as an NPM Package
    1. NPM Registry - ProductsList
4. Team in charge of Container install ProductList as a dependency.
5. Container team build their app.
6. Output bundle that includes all the coe for ProductsList.

### Pros and Cons
* Pro: Easy to setup and understand!
* Con: Container has to be re-deployed every time ProductsList is updated.
* Con: Tempting to tightly couple the Container + ProductsList together.


## Run-Time Integration
1. Engineering team develops ProductsList
2. Time to Deploy!
3. ProductsList code deployed at `https://my-app.com/productlists.js`
4. User navigates to my-app.com, Container app is loaded.
5. Container app fetches productlist.js and executes it. 

### Pros and Cons
* Pro: ProductList can be deployed independently at any time.
* Pro: different versions of ProductList can be deployed and Container can decide which one to use.
* Con: Tooling + setup is far more complicated.

## This focuses on RunTime Integration using `Webpack Module Federation`.
* Hardest to setup + understand - makes sense to cover it in great detail.
* Most flexible and performant solution around right now. 

## Webpack
* Combines many JS files into one single file. 

## Using Shared Modules

Adding Configuration to ModuleFederationPlugin to avoid repetitive load of the same modules.

1. Container fetches Products remoteEntry.js file
2. Container fetches Cart remoteEntry.js file.
3. Container notices that both require Faker!
4. Container can choose to load only one copy from either Cart or Products
5. Single copy is made available to both Cart + Products

If we run the application in isolation we run into problem while importing/accessing dependencies because they are loaded asynchronously. 

## Sub-Application Execution Context

We assume there is an element on the html document with the specific id for what is going to be shown. Maybe the container team does not have the same id in the container html file. 

## Building the Application

We are going to be building a SAS application with dummy elements and without real data.

1. Landing Page
2. Pricing Page
3. SignUp / SignIn
4. Dashboard (Pretty Charts and Tables)

### Marketing (React.js)
1. Home Page 
2. Pricing Page

### Authentication (React.js)
1. Sign in page
2. Sign up page

### Dashboard (Vue.js)
1. Dashboard Page 

## Requirements

### Inflexible Requirement #1
* Zero coupling between child projects
1. No importing of functions/classes/etc
2. No shared state
3. Shared libraries through MF(Module Federation) is ok.

### Inflexible Requirement #2
* Near-zero coupling between container and child apps
1. Container should not assume that a child is using a particular framework.
2. Any necessary communication done with callbacks or simple events.

### Inflexible Requirement #3
* CSS from one project should not affect another.

### Inflexible Requirement #4
* Version control (monorepo vs separate) should not have any impact on the overall project.
1. Some people want to use monorepos
2. Some people want to keep everything in a separate repo.

### Inflexible requirement #5
* Container should be able to decide to always use the latest version of a micrfrontend or specify a specific version
1. Container will always us the latest version of a child app (doesn't require a redeploy of container.)
2. Container can specify exactly what version of a child it wants to use. (requires redeploy to change)

### Delegating Shared Module Section

Require the package.json file into the shared key in the webpack.dev.js file. 

## Deployment

1. Want to deploy each microfrontend independently (including the container)
2. Location of child app remoteEntry.js files must be known at build time!
3. Many front-end deployment solutions assume you are deploying a single project - we need something that can handle multiple different ones.
4. Probably need a CI/CD pipeline of some sort.
5. At present, the remoteEntry.js file name is fixed! Need to think about caching issues.

### Workflow for Deploying a Container
* Whenever code is pushed to the master/main branch and the commit contains a change to the container folder
1. Change into the container folder
2. Install dependencies
3. Create a production build using webpack
4. Upload the result to AWS S3

Any time you add new files to S3 bucket cloudfront picks them up but ignores all updates to files. One way we can specify changes is using Invalidation. This can be automated. See deployment-workflow


### Production Style Workflow Example
1. Each team develops features on git branches named something like 'container-dev'
2. Feature complete and ready for deployment? Push branch to github.
3. Create pull request to merge into master/main
4. Other engineers review 
5. When ready to deploy, merge the PR.
6. Workflow detects a change to the master/main branch, deployment runs!

## Handling CSS in Microfrontends

### CSS Scoping

* Custom CSS ypu are writing for your project
    1. Use a CSS-in-JS library
    2. Use Vue's built-in component style scoping
    3. Use Angular's built-in component style scoping
    4. "Namespace" all your CSS


* CSS coming from a component library or CSS library (bootstrap)
    1. Use a component library that does css-in-js
    2. Manually build the css library and apply the namespacing techniques to it.

## Implementing Multi-Tier Navigation

### Project Requirements
1. Both the Container + Individual SubApps need routing features
    * Users can navigate around to different subapps using routing logic built into the COntainer.
    * Users can navigate around in a subapp using routing logic built into the subapp itself.
    * Not all subapps will require routing.

2. Sub-apps might need to add in new pages/routes all the time.
    * New routes added to the subapp shouldn't require a redeploy of the container. 

3. We might need to show two or more microfrontends at the same time.
    * This will occur all the time if we have some kind of sidebar nav that is a separate microfrontend. 

4. We want to use off-the-shelf routing solutions.
    * Building a routing library can be hard - we don't want to author a new one!
    * Some amount of custom coding is OK.

5. We need navigation features in sub-apps in both hosted mode and isolation.
    * Developing for each environment should be easy - a developer should immediately be able to see what path they are visiting.

6. If different apps need to communicate information about routing, it should be done in as generic fashion as possible.
    * Each app might be using a completely different navigation framework. 
    * We might swap out or upgrade navigation libraries all the time - shouldn't require a rewrite of the rest of the app. 

Browser History Object: Look at the path portion of the url (everything after the domain) to figure out what the current path is. 

Hash History: look at everything after the '#' in the URL to figure out the current path.

Memory or Abstract History: Keep track of the current path in memory.

Browser History inside container and Memory History inside the Sub-Applications.

Communication between apps:
* Down:
    1. User clicks link governed by Container (Browser History)
    2. Communicate change down to Marketing
    3. Marketing's Memory History should update its current path.

* Up:
    1. User click link governed by Marketing (Memory History)
    2. Communicate change up to Container
    3. Container's Browser History should update its current path.




