---
layout: page
permalink: /install/
---

#### Overview
1. [Graph database](#graph-database)
    1. [Neo4j](#neo4j)
    2. [Import an existing graph](#import-an-existing-graph)
        1. [Automatic import](#automatic-import-recommended)
        2. [Own import](#own-import-not-recommended)
    3. [Graph style sheet](#graph-style-sheet)
    4. [View your imported data](#view-your-imported-data)
2. [IVE](#ive)
    1. [Git/GitHub](#gitgithub)
    2. [GitHub repository](#github-repository)
    3. [Nodejs](#nodejs)
    4. [Bower](#bower)
    5. [Setup your local environment variables](#setup-your-local-environment-variables)
    6. [Server-settings (only for maintainers)](#server-settings-only-for-maintainers)
3. [Media files](#media-files)
4. [Starting the IVE](#starting-the-ive)
5. [Using the IVE](#using-the-ive)
6. [Documentation](#documentation)

***

# 1. Graph database

### 1.1. Neo4j

* Go to [https://neo4j.com/download/](https://neo4j.com/download/) and download the latest community-version of Neo4j. If you are on Linux, like Ubuntu, make sure, that you have Java 8 installed, which is not included in Ubuntu 14.04 LTS or Debian 8 (Jessie).
* If you are on macOS you can alternatively use Homebrew ([http://brew.sh/index_de.html](http://brew.sh/index_de.html)) to install Neo4j:
* Install and run Neo4j
* Open the UI in webbrowser: [http://localhost:7474](http://localhost:7474)
* If you have installed it on a Ubuntu Server, you might need to open the port, so that you can access the UI on your host. Open the config file: `sudo nano /etc/neo4j/neo4j.conf` and change the following lines like this:

```
# HTTP Connector
dbms.connector.http.type=HTTP
dbms.connector.http.enabled=true
# To accept non-local HTTP connections, uncomment this line
dbms.connector.http.address=0.0.0.0:7474

# HTTPS Connector
dbms.connector.https.type=HTTP
dbms.connector.https.enabled=true
dbms.connector.https.encryption=TLS
# To accept non-local HTTPS connection, change 'localhost' to '0.0.0.0'
dbms.connector.https.address=localhost:7473
```

* Restart Neo4j with `sudo neo4j restart` and open the UI in webbrowser again. If you have access it for the first time, you need to create a username (`neo4j`) and password (`neo4j`) for your database. Change your password to `123456` as a default setting, which are used in the node-scripts.

### 1.2. Import an existing graph

* If you want to import the data from the CSV files of `IVE/data/*`, you need to setup the import-path for Neo4j. Open the config file `sudo nano /etc/neo4j/neo4j.conf` and set the directory to the path of your local repository, e.g.:

```
dbms.directories.import=/Users/sitcomlab/IVE/data/
```

#### 1.2.1. Automatic import (RECOMMENDED)
You can use a setup-script to prepare the database CONSTRAINTS and import all CSV-files of the [four scenarios]({{ site.baseurl }}/data/#available-scenarios) automatically. If you want to do it manually - for example with your own CSV-files - then checkout the instructions of [1.2.2.](#own-import-not-recommended)

* If you don't have Nodejs installed, please follow the instructions of [2.3.](#nodejs) first.
* Execute the setup-script with the following command (run the command with `sudo`, if you don't have permission):

```
node setup.js
```

* If you need to specify the **NODE ENVIRONMENT VARIABLES**, these parameters can be set:
    * `DB_HOST`: Neo4j-database host address (default: `127.0.0.1`)
    * `DB_PORT`: Neo4j-database port number (default: `7687`)
    * `DB_USER`: Neo4j-database username (default: `neo4j`)
    * `DB_PASSWORD`: Neo4j-database password (default: `123456`)
* Run the following command, like this:

```
# Linux & macOS
DB_PORT=7687 DB_USER=neo4j DB_PASSWORD=neo4j node setup.js

# Windows
set DB_PORT=7687 DB_USER=neo4j DB_PASSWORD=neo4j node setup.js
```

#### 1.2.2. Own import (NOT RECOMMENDED)

You setup the database CONSTRAINTS and import all CSV-files manually by following the next steps, but it is highly recommended to use the setup-script to do this job for you. A manually setup is only necessary, if you need a clean installation without any imported data.

* To define some CONSTRAINTS inside the database, open the GUI in your webbrowser and execute the following Cypher commands (**one by one**) in the Neo4j-shell (for resetting, you can find the commands also in  `IVE/install/import.cypher`):

```
CREATE CONSTRAINT ON (scenario:Scenarios) ASSERT scenario.s_id IS UNIQUE;

CREATE CONSTRAINT ON (location:Locations) ASSERT location.l_id IS UNIQUE;

CREATE CONSTRAINT ON (video:Videos) ASSERT video.v_id IS UNIQUE;

CREATE CONSTRAINT ON (overlay:Overlays) ASSERT overlay.o_id IS UNIQUE;
```

* After this step, you are able to import the data from CSV files. You can run all Cypher commands (**one by one**) from the file `IVE/queries/setup/` folder. But the setup-script contains all of those commands and can also do this job for you.

#### 1.3. Graph style sheet

With a **graph-style-sheet** for the Neo4j Browser, you can customize the highlighting of your nodes and relationships. Neo4j automatically visualizes the nodes with different colors for different labels, but if you want to use the same color coding as the IVE, you can find a `grass.css` file in the repository. Drag and drop it, like this:

[<img src="{{ site.baseurl }}/images/grass_import.png" alt="GRASS" class="picture" />]({{ site.baseurl }}/)

If you need more information, please checkout the Neo4j manual at  [https://neo4j.com/developer/guide-neo4j-browser/#_advanced_styling](https://neo4j.com/developer/guide-neo4j-browser/#_advanced_styling).

(The following styles are for future implementations and currently not supported by the IVE or Neo4j [https://github.com/neo4j/neo4j-browser/issues/131](https://github.com/neo4j/neo4j-browser/issues/131))

```css
node.Users {
  color: #FF8000;
  border-color: #DE6F00;
  text-color-internal: #FFFFFF;
  caption: '{name}';
  diameter: 80px;
}

node.Locations[location_type="abstract"] {
  color: #32CD32;
  border-color: #2CB32C;
  text-color-internal: #FFFFFF;
  caption: '{name}';
  diameter: 80px;
}
```

#### 1.4. View your imported data

* Check if your data has been imported correctly with the following cypher query:

```
MATCH (n) RETURN n;
```

***

# 2. IVE

### 2.1. Git/GitHub
* If you have Git already installed, you can use the CLI in your terminal.

* Install Git: [https://git-scm.com](https://git-scm.com)

* Install the GitHub client: [https://desktop.github.com](https://desktop.github.com)

### 2.2. GitHub repository

* Clone the repository to your local (run the command with `sudo`, if you don't have permission):

```
git clone https://github.com/sitcomlab/IVE.git
```

* **If you want to develop or extend the IVE, please make a fork as first and send after your implementation a pull-request!**

### 2.3. Nodejs

* Install Nodejs: [https://nodejs.org](https://nodejs.org)
* Install required node-modules from the `IVE/package.json` inside the repository (run the command with `sudo`, if you don't have permission):

```
node npm install
```

### 2.4. Bower

* Install Bower via **npm** (run the command with `sudo`, if you don't have permission):

```
node npm bower -g
```

* Install required bower_components from the `IVE/bower.json`:

```
bower install
```

* If you need root-permission, install dependencies with this command:

```
sudo bower install --allow-root
```

### 2.5 Setup your local environment variables

* Before you can use the IVE you need to specify the **NODE ENVIRONMENT VARIABLES** by creating a `.env` file. It is also possible to create these variables on runtime, please see section [4. Starting the IVE](#starting-the-ive), but storing them in a file is the recommended way. You can make use of the example-file by coping it to your local repository:

```
cp .env.sample .env
```

### 2.6 Server-settings (only for maintainers)

* If you have installed the IVE on a Linux server, you can create a cronjob to automatically start Neo4j and the server after a reboot. Open `sudo nano /etc/crontab` and add the following lines:

```
# Start Neo4j
@reboot         root    neo4j restart

# Start IVE
@reboot         root    cd /home/<username>/IVE && PORT=4000 DB_USER=<NEO4J> DB_PASSWORD=<NEO4J> node server.js >> log.txt
```

* Add an optional `>> log.txt` to automatically log the output of the console to a text-file.

***

# 3. Media files

* If you have imported the CSV files of available scenarios from step 1.2.1. you have to download the required media files
* All content for the IVE (videos, thumbnails and overlay images, etc.) is available on the university cloud storage [Sciebo](https://www.sciebo.de). Please create an account, if you don't have one yet.
* Then create in your repository the following folders:
    * `public/videos`
    * `public/images`
    * `public/thumbnails`
* After that, ask a local team member of the Situated Computing Lab to get access to the online folders of the cloud storage. You can decide which material of the available scenarios you want to download or to download them all. **Attention: Please checkout the file sizes of the folders, before you actually downloading them!**

***

# 4. Starting the IVE

```
node server.js
```

* If you need to specify the **NODE ENVIRONMENT VARIABLES**, these parameters can be set:
    * `NODE_ENV`: server environment (default: `development`, option: `production`)
    * `SERVER_URL`: url of the nodejs-server (default: `http://giv-sitcomdev.uni-muenster.de`)
    * `HTTP_PORT`: port number of the nodejs-server: (default: `5000`)
    * `HTTPS_PORT`: secure port number of the nodejs-server: (default: `HTTP_PORT + 443`)
    * `DB_HOST`: Neo4j-database host address (default: `127.0.0.1`)
    * `DB_PORT`: Neo4j-database port number (default: `7687`)
    * `DB_USER`: Neo4j-database username (default: `neo4j`)
    * `DB_PASSWORD`: Neo4j-database password (default: `123456`)
    * `ADMIN_USERNAME`: Username for the admin account (default: `admin`)
    * `ADMIN_PASSWORD`: Password for the admin account (default: `admin`)
    * `JWTSECRET`: Secret for the JSON-Webtoken-authentication (default: `superSecretKey`)
* You can also save them in a `.env` file
* Run the following command, like this:

```
# Linux & macOS
HTTP_PORT=4000 node server.js

# Windows
set HTTP_PORT=4000 node server.js
```

***

# 5. Using the IVE

* Open a webbrowser and go to [http://localhost:4000](http://localhost:4000/) (there is also a **night-version** for the demonstrations in the IVE: [http://localhost:4000/ive.html](http://localhost:4000/ive.html))

* Open the **VIEWER** in a new tab ([http://localhost:4000/frontend](http://localhost:4000/frontend))
* Open the **REMOTE CONTROL APP** in a new tab or on your smartphone ([http://localhost:4000/remote](http://localhost:4000/remote))
* In the remote app, select a Scenario from the list
* After that, select a starting location

Have fun!

***

# 6. Documentation

* If you want to contribute to this documentation, you need to install Jekyll ([https://jekyllrb.com/docs/installation/](https://jekyllrb.com/docs/installation/)) on your local machine. **Attention**: Jekyll is not officially supported by Windows. Please follow the instructions on their website.
* Switch to the `gh-pages` branch in your local repository:

```
git checkout gh-pages
```

* Run Jekylls built-in-server with the following command (run it with `sudo`, if you don't have permission):

```
jekyll serve
```

* Open a webbrowser and go to: [http://localhost:4000/](http://localhost:4000/)
* Open the markdown files and start writing.
* If you want to write a blog-post, create a new `.md` file inside the folder `_posts` with the name `YYYY-MM-DD-TOPIC`, e.g. `2016-10-23-Introducing-v2.md`.
* For adding new (static) pages, please read the documentation and make sure that you have set a header-section and added (static) page to the `_config.yml` file.
