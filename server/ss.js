module.exports = function (app) {
    const createButtons = (displayUrl) => {
        return {
          messages:[
            {
              attachment: {
                type: 'template',
                payload: {
                  template_type: 'generic',
                  image_aspect_ratio: 'square',
                  elements: [{
                    title: 'Welcome!',
                    subtitle: 'Choose your preferences',
                    buttons:[
                      {
                        type: 'web_url',
                        url: displayUrl,
                        title: 'Webview (compact)',
                        messenger_extensions: true,
                        webview_height_ratio: 'compact' // Small view
                      },
                      {
                        type: 'web_url',
                        url: displayUrl,
                        title: 'Webview (tall)',
                        messenger_extensions: true,
                        webview_height_ratio: 'tall' // Medium view
                      },
                      {
                        type: 'web_url',
                        url: displayUrl,
                        title: 'Webview (full)',
                        messenger_extensions: true,
                        webview_height_ratio: 'full' // large view
                      }
                    ]
                  }]
                }
              }
            }
        ]};
      };
      
      
      app.get('/show-buttons', (request, response) => {
        const {userId} = request.query;
        const displayUrl = 'https://staging.kibopush.com/show-webview';
        response.json(createButtons(displayUrl)); 
      });
      
      app.get('/show-webview', (request, response) => {
        response.sendFile(__dirname + '/views/webview.html');
      });
      
      app.get('/login', (request, response) => {
        response.sendFile(__dirname + '/views/login.html');
      });
      
      app.get('/verify-phone', (request, response) => {
        response.sendFile(__dirname + '/views/verify-phone.html');
      });
      
      app.get('/verify-code', (request, response) => {
        response.sendFile(__dirname + '/views/verify-code.html');
      });
      
      app.get('/terms', (request, response) => {
        response.sendFile(__dirname + '/views/terms.html');
      });
      
      app.get('/dashboard', (request, response) => {
        response.sendFile(__dirname + '/views/dashboard.html');
      });
      
      app.get('/benefitsAndPayments', (request, response) => {
        response.sendFile(__dirname + '/views/benefitsAndPayments.html');
      });
      
      app.get('/estimatedBenefits', (request, response) => {
        response.sendFile(__dirname + '/views/estimatedBenefits.html');
      });
      
      app.get('/earningsRecord', (request, response) => {
        response.sendFile(__dirname + '/views/earningsRecord.html');
      });
      
      app.get('/myProfile', (request, response) => {
        response.sendFile(__dirname + '/views/myProfile.html');
      });
      
      app.get('/securitySettings', (request, response) => {
        response.sendFile(__dirname + '/views/securitySettings.html');
      });
      
      app.get('/updateContactInformation', (request, response) => {
        response.sendFile(__dirname + '/views/updateContactInformation.html');
      });
      
      app.get('/newfile', (request, response) => {
        response.sendFile(__dirname + '/views/newfile.html');
      });
      
}

