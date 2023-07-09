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

