const debug = require('debug')('pt:resources:broadcast');

const jwt = require('jsonwebtoken');

// create a broadcast
const createBroadcast = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://api.pagertree.com/broadcast',
    body: {
      message: bundle.inputData.message, // json by default
      source_id: jwt.decode(bundle.authData.sessionKey).id,
      user_ids: [ bundle.inputData.user_ids ]
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

module.exports = {
  key: 'broadcast',
  noun: 'Broadcast',

  create: {
    display: {
      label: 'Create Broadcast',
      description: 'Creates a new broadcast.'
    },
    operation: {
      inputFields: [
        {key: 'message', required: true, label: "Message", helpText: "Add a message to the broadcast!"},
        {key: 'user_ids', required: true, label: "Destination User", dynamic: 'userList.id.name', helpText: "Who should we send the broadcast to?"},
      ],
      perform: createBroadcast
    },
  },

  sample: {
    message: 'Test broadast from zapier'
  },

  outputFields: [
    {key: 'sid', label: 'SID'},
    {key: 'id', label: 'ID'},
    {key: 'createdAt', label: 'Created At'},
    {key: 'message', label: 'message'}
  ]
};
