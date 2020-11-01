# architecture
This file is about the technical challenges of semuncia and the way different
components interact with each other.

## front-end
Transactions will be stored using JS localStorage and JSON. That way they can
easily be saved to the machine or sent to the server if the user desires to do
so.

## back-end
The back end will (probably) be a nginx server with nodejs.

##protocol
{
	type: get, push, disconnect;
	id: ID;
	IV: (probably, depending on encryption scheme);
	data: data, undefined
}

###details
Client pushes undefined data: Delete. Server does not forward to other sessions. Server tells other clients to disconnect.
Server pushes undefined data: (Response to client get.) The server does not yet have data. The client responds by pushing data.
