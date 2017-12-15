It has been observed that our testing and error reporting should be improved further. Here is the current scenario:

1. Tester does the testing
2. Reports the bugs with screenshots

Here is the suggested scenario:

1. Tester does the testing
2. Analyse and understand the root cause of the error
3. Report to the bug with screenshots, logs and other analysis information

The automated testing will be done to avoid repeated small tests. However, manual tests will be done for critical points as well. Whenever, any tests fail, the tester would first go and reproduce it again and then try to analyse the reason of the failure. So when the tester opens the github issue, he would not only define the error and put screenshots, he would also give the proper analysis and logs for the errors. He would say where the error is happening.

Now, this will help the tester to understand where the issues belongs to i.e. is it server side issue or is it client side issue. Tester would be able to open it in correct side and milestone. This would also let us know if it was regression or an undiscovered bug.

**Analysis methods**

- **Logs**: I have explained all of the team on how to use the papertrail. We have two instances of papertrail: one for production and one for staging. Whenever you find a bug, please take the screenshot, and read the client side and server side logs on papertrail. Not all client side logs are being sent to papertrail so you might look into browser logs as well. All the server side logs are sent to papertrail. If you think you need more detailed log from server, do let me know I would add it.
- **Database**: All of the team members must have RoboMongo installed on their system. With this, please connect to our staging database. This can be used to analyse the database and see if correct data is stored on the database or not. This would help in understanding if server is storing or sending wrong data.
- **PostMan**: If you even need to see if API is working correctly or not, then you can use the PostMan tool as well. Please download it. I had setup it on computers of couple of team members as well. Let me know if you want to understand how to use it. I had shown its demo to some of you.
- **Localhost**: Even if you don’t understand the cause of bug by above methods, then you should run the latest copy of code on your local machine using ngrok and try to reproduce the same bug on localhost and see what is happening on your computer. Please don’t change the code at that time just analyze the code.
- **Run the code manually on staging server (CRITICAL)**: You would rarely need to do this. This is for understanding those crashes which are happening on server but not your local machine. This is very rare case and you should do this level of analysis in my presence or ask me to do it for you. Please don’t do this unnecessarily it might take the server down.

These analysis steps are in order so start from top. Most probably you would know the cause of error in first 2 steps and you would not need to go deeper in analysis.

Please henceforth, do the testing and reporting of bugs according to this document.

