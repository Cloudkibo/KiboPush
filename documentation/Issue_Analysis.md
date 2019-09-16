Team,

For any bug, please don’t rush to just fix it. I know most of them would be either one liner fix or little bit more. Feature is there, so we are just fixing bug and not rewriting it. Instead of just fixing the one liner issue and declaring victory, please do the analysis and come up with root cause. Here is the method you should work on any assigned bug:

1. Identify what broke the code?
2. Identify the commit and developer who is responsible for that change.
3. What is the way that we can ensure that this code doesn’t break again.
4. Don’t just blindly fix by doing the reverse of code that broke it. There must be some reason for writing of that code. Explain the reason before you put fix.

**Note:** I won’t accept the pull request if I don’t get answers to these questions before the fix.

Let’s follow this procedure and we are going to make pull request review a bit tougher which means **the code file where you did bug fix will be your responsibility** that it should not break again. If you need to refactor some bits along your fix please do but make sure you don’t leave any chances of bug in that particular file.
