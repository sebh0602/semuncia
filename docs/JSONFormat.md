# JSON Format
## Sample
```JSON
data = {
	"config":{
		"showSideNav":false
	},
	"language":"en",
	"text":{
		"example":{
			"en":"example",
			"de":"Beispiel"
		}
	},
	"initialAmount":1234.56,
	"transactions":{
		"2018-03-11":[
			{"date":"YYYY-MM-DD","type":"+","amount":123456,"title":"MyTransaction","categories":[]},
			{"date":"YYYY-MM-DD","type":"+","amount":123456,"title":"MyTransaction","categories":["food"]}
		],
		"2018-03-12":[
			{"date":"YYYY-MM-DD","type":"+","amount":123456,"title":"MyTransaction","categories":["technology", "amazon"]}
		]
	},
	"recurringTransactions":[
		{
			"recurUnit":"month",
			"recurPeriod":1,
			"type":"+",
			"amount":16000,
			"title":"Recurring transaction",
			"categories":[],
			"startDate":"YYYY-MM-DD"
		}
	]
}
```
All monetary values are in cents.
