# Leaflet-Light-Cluster
A leaflet extension that allows a server side clustering solution for geospatial data.

# Reason for Development
When plotting many points on a map it is useful to cluster these points in order to clean up the map and make data more sightly.  However many existing clustering tools expect all of the data up front and then perform various clustering analyses on the points which can lead to poor client side performance if your point objects have many attributes.  For example, in our application we had millions of points each with over a hundred attributes; therefore trying to cluster these on the client side often led to the browser crashing.  This extension allows a developer to create a server side clustering solution boosting client side performance and giving you more control over how your data is grouped.

# Running the Demo
If you want to see a basic working example of this extension there is one included under the ExampleProject Folder. You'll need to install node.js and make sure the npm command works from your command line or terminal.  Then in your terminal navigate to the ExampleProject folder.  Run 'npm install'; this should install all the packages you'll need for you.  If not you can install each individually using 'npm install {packageName}'.  
The packages you'll need are:
body-parser
cookie-parser
debug
express
jade
morgan
serve-favicon

Once installed, run 'npm start', open your browser and go to localhost:3000.
Thats it have fun!
