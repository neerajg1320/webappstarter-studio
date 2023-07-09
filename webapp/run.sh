Terminal 1:
cd packages/local-client
npm run build 

cd ../../

# In the root dir of project
npm run start

Terminal 2:
cd packages/cli/dist
node index.js serve -p 4005