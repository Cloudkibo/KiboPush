Installation pointers.

For database setup, we should always run script `npm run start:migration`.

## Setup Database

    sudo apt-get update
    sudo apt-get install mysql-server
    sudo mysql_secure_installation

Create the database and users.
    

#### Install nodejs

https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04


#### Install Forever

To install forever run the following command:

    npm install forever -g
    
#### Install Git

    sudo apt-get update
    sudo apt-get install git

#### Clone

Now, clone the project:

    git clone https://github.com/Cloudkibo/KiboPush/

#### Redirect the ports to our application ports
Run following two commands

    iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
    iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 8443

Now on terminal, set the environment variables in /etc/environment.

    nano /etc/environment
    
We need to set the following variables: (Just copy paste and then change the values)

    NODE_ENV=production
    SESSION_SECRET=<YOUR KEY>
    FACEBOOK_ID=<YOUR FB ID>
    FACEBOOK_SECRET=<YOUR FB SECRET>
    DOMAIN=<YOUR DOMAIN>
    DB_SCHEMA=<YOUR DB NAME>
    DB_USER=<YOUR DB USER>
    DB_PASSWORD=<YOUR DB PASSWORD>
    DB_HOST=localhost
    DB_PORT=3306
    

Now, run the migrations to setup the database schemas:

   npm run start:migration:prod
   
   
