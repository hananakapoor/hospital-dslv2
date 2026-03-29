# Install Project Dependencies
Open PowerShell, navigate to the project root folder and run:
cd C:\Projects\hospital-dsl
npm install

# Download ANTLR (One-time setup)
Create a folder for ANTLR and download the JAR file:
mkdir C:\antlr
cd C:\antlr
# Download antlr-4.13.1-complete.jar from:
  https://www.antlr.org/download/antlr-4.13.1-complete.jar
  Place it in C:\antlr\

Then add the ANTLR command to PowerShell. Open your profile:
notepad $PROFILE
 
# Add this line and save:
function antlr4 { java -jar "C:\antlr\antlr-4.13.1-complete.jar" $args }
 
# Reload profile:
. $PROFILE

# Regenerate the ANTLR Parser
Navigate to the grammar folder and regenerate the parser files:
cd src\grammar
java -jar C:\antlr\antlr-4.13.1-complete.jar -Dlanguage=JavaScript -visitor -o ..\parser HospitalDSL.g4
cd ..\..
#  In root folder run the following commands to validate the code and generate the app
#  node cli.js validate examples/sunflower-clinic.hospital  
#  node cli.js generate examples/sunflower-clinic.hospital

#  Database Setup (MongoDB Atlas)
This project uses MongoDB Atlas (free cloud database). Follow these steps:

1.	Go to https://www.mongodb.com/cloud/atlas/register and create a free account
2.	Create a free M0 cluster (choose any region)
3.	Go to Database Access → Add New Database User → set a username and password
4.	Go to Network Access → Add IP Address → Allow Access from Anywhere
5.	Go to Database → Connect → Drivers → copy the connection string

Your connection string will look like:
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/hospitaldsl

Open the file generated\.env and update it with your connection string:
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/hospitaldsl
PORT=5000

#  Running the Project

The generated app is already inside the generated\ folder. Just install and run:

Terminal 1 — Start the Backend
cd C:\Projects\hospital-dsl\generated
npm install
node server.js
 
# Expected output:
# 🚀 Server running on http://localhost:5000
# ✅ MongoDB connected

Terminal 2 — Start the Frontend
cd C:\Projects\hospital-dsl\generated\frontend
npm install
npm run dev
 
# Expected output:
# VITE v5.x.x  ready in 500ms
# ➡  Local:   http://localhost:5173/

Open in Browser
http://localhost:5173
