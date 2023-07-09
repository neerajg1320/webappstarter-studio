npx create-react-app jbook --template=typescript
cd jbook

npm install esbuild-wasm@0.8.27

# For loading easily
cp node_modules/esbuild-wasm/esbuild.wasm public

npm install --save-exact @monaco-editor/react@3.7.5 --legacy-peer-deps
npm install monaco-editor --legacy-peer-deps

# Sec-11, Chapter-140 downgrade CRA (create-react-app)
# Changes required for libraries:
#   monaco-jsx-highlighter
#   jscodeshift 
# 
# In package.json set version for react-scripts: "react-scripts": "4.0.1",
# If we are on node18 or above then use following
# Modify start script: "start": "react-scripts --openssl-legacy-provider start",
rm package-lock.json
rm -r node_modules
npm install --legacy-peer-deps


npm install --save-exact monaco-jsx-highlighter@0.0.15 jscodeshift@0.11.0 @types/jscodeshift@0.7.2

npm install --save-exact react-resizable@3.0.4 @types/react-resizable@3.0.2 --legacy-peer-deps

npm install --save-exact @uiw/react-md-editor@2.1.1

npm install --save-exact react-redux redux @types/react-redux redux-thunk@2.3.0 --legacy-peer-deps

npm install immer

npm install @fortawesome/fontawesome-free@5.15.1 --legacy-peer-deps

# Section 21, structure of the project. 
# Chapter 275: Lerna

# Remove the older lerna
nvm use v16.17.1
npm remove -g lerna

npm install -g --save-exact lerna@3.22.1
# Check the lerna version and ensure it is 3.22.1
lerna -v

# In folder jbook
mkdir local-client
mv * local-client

# 
lerna init
mv local-client packages 
cd packages

mkdir cli
mkdir local-api

cd cli
npm init -y

cd ../local-api
npm init -y

# Lerna documentation link
# https://github.com/lerna/lerna

lerna add commander --scope=cli
lerna add local-api --scope=cli

lerna add typescript --scope=local-api
cd local-api/
npx tsc --init

# Add tsc --watch in "start" script
npm run start

# Add typescript support in cli project as well
lerna add typescript --dev --scope=cli
cd cli/
npx tsc --init

lerna add @types/node  --dev --scope=cli

lerna add express --scope=local-api
lerna add @types/express --dev  --scope=local-api
lerna add cors --scope=local-api
lerna add @types/cors --dev  --scope=local-api
lerna add http-proxy-middleware --scope=local-api

# Make production build for react.
cd local-client
npm run build 

# Make local-client a dependency of local-api
lerna add local-client --scope=local-api