## Papertrail

By default we are only logging error logs on Papertrail. If someone is debugging an issue and they need to log other log levels as well, then you can use this guide to turn on other log levels. Once done, please don't forget to turn off other levels again.

#### How to turn on other levels

    ssh @<server's ip address>
    nano /etc/environment

Look for PAPERTRAIL_LOG_LEVELS and put other log levels in that array. i.e. to enable info logs do this:

    PAPERTRAIL_LOG_LEVELS="error,info"

Save the file by using CTRL+X and restart the server.

#### How to turn off other levels

    ssh @<server's ip address>
    nano /etc/environment

Look for PAPERTRAIL_LOG_LEVELS and remove log levels other than error.

    PAPERTRAIL_LOG_LEVELS="error"

Save the file by using CTRL+X and restart the server.
