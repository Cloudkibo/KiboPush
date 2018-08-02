exports.renderJS =  (pageId, appId) => {
  return  `
		window.fbAsyncInit = function() {
	    FB.init({
	      appId            : ${appId},
	      autoLogAppEvents : true,
	      xfbml            : true,
	      version          : 'v3.1'
	    });

	    FB.Event.subscribe('messenger_checkbox', function(e) {
	      console.log("messenger_checkbox event");
	      console.log(e);
	      
	      if (e.event == 'rendered') {
	        console.log("Plugin was rendered");
	      } else if (e.event == 'checkbox') {
	        var checkboxState = e.state;
	        console.log("Checkbox state: " + checkboxState);
	      } else if (e.event == 'not_you') {
	        console.log("User clicked 'not you'");
	      } else if (e.event == 'hidden') {
	        console.log("Plugin was hidden");
	      }
	      
	    });
	  };



	  (function(d, s, id){
	     var js, fjs = d.getElementsByTagName(s)[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement(s); js.id = id;
	     js.src = "https://connect.facebook.net/en_US/sdk.js";
	     fjs.parentNode.insertBefore(js, fjs);
	   }(document, 'script', 'facebook-jssdk'));
	
       
  		(function () {
		  console.log('Executing KiboPush Script')
		  let element = document.createElement('div')
		  const pageId = ${pageId}
		  let text = document.createTextNode('Hello From KiboPush: ' + pageId)
		  let messengerComponent = document.createElement('div')
		  messengerComponent.classList.add("fb-messenger-checkbox");
		  messengerComponent.setAttribute('origin', 'https://cloudkibo.myshopify.com/');
		  messengerComponent.setAttribute('page_id',  pageId);
		  messengerComponent.setAttribute('messenger_app_id',  ${appId});
		  messengerComponent.setAttribute('user_ref',  Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7));
		  messengerComponent.setAttribute('ref',  Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7));
		  messengerComponent.setAttribute('center_align', true);
		  element.innerHTML = '<button style="display:block; margin-left: 30px; margin-bottom:15px; color: white; background: skyblue; border: 0; padding: 5px;">Subscribe to get discount offers</button>'
		  element.prepend(messengerComponent)
		  element.style['background'] = '#EEEEEE'
		  element.style['text-align'] = 'center'
		  element.style['z-index'] = '100'
		  element.style['position'] = 'fixed'
		  element.style['vertical-align'] = 'middle'
		  element.style['color'] = 'grey'
		  element.style['padding-top'] = '10px'
		  element.style['bottom'] = '15px'
		  element.style['right'] = '15px'
		  element.style['border-top-style'] = 'solid'
		  element.style['border-top-color'] = 'red'
		  if (window.location.pathname.split('/').length == 2 && window.location.pathname.split('/')[1] == 'cart') {
		    console.log('Component Will Render')
		    $.ajax({
		      type: 'GET',
		      url: '/cart.js',
		      cache: false,
		      dataType: 'json',
		      success: function (cart) {
					  console.log('Hurray I got the cart object', cart)
		      }
				    })
		    document.body.prepend(element)
		  }
		  console.log('Successfully executed KiboPush Script')
		}())`
};


