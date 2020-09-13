# ideas
Having made a different money management program previously, I already have some
expectations as to what this software should do, and in which form it should
exist.

## platform
I want this software to be cross-platform compatible with a html/css/javascript
webinterface ported to different platforms, such as Windows (Electron) and
Android (Cordova)

## features (front-end)
This list of features is neither binding, nor finished. Finished items will be
~~crossed off~~.
* Ability to add transactions
* Ability to choose a category
* Autocomplete for transactions
* A graph showing different statistics over time
* Different tabs/accounts/folders/budgets
* Search through transactions
* Scheduled transactions

## features (back-end)
In this case, back-end refers to anything an average user wouldn't need to
know. Finished items will be ~~crossed off~~.
* Make it a progressive web app/offline web application
* Use OpenID or similar for the authentication
(maybe https://auth0.com/pricing)
	* https://developers.google.com/identity/sign-in/web/sign-in
	* https://developers.facebook.com/docs/facebook-login
	* It should still be possible to log in without social login
	* Maybe jut use google and regular sign in/on
* Make the site fully responsive
