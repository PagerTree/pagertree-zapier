// get a single user
const getUser = (z, bundle) => {
  const responsePromise = z.request({
    url: `https://api.pagertree.com/user/${bundle.inputData.id}`,
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

// get a list of users
const listUsers = (z) => {
  const responsePromise = z.request({
    url: 'https://api.pagertree.com/user',
    params: {
      order_by: 'id desc'
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content).data);
};

// find a particular user by name
const searchUsers = (z, bundle) => {
  const responsePromise = z.request({
    url: 'https://api.pagertree.com/user',
    params: {
      query: `name=${bundle.inputData.name}`
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content).data);
};

// create a user
const createUser = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://api.pagertree.com/user',
    body: {
      name: bundle.inputData.name, // json by default
      email: bundle.inputData.email
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

module.exports = {
  key: 'user',
  noun: 'User',

  get: {
    display: {
      label: 'Get User',
      description: 'Gets a user.'
    },
    operation: {
      inputFields: [
        {key: 'id', required: true}
      ],
      perform: getUser
    }
  },

  list: {
    display: {
      label: 'New User',
      description: 'Lists the users.'
    },
    operation: {
      perform: listUsers
    }
  },

  search: {
    display: {
      label: 'Find User',
      description: 'Finds a user by searching.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: searchUsers
    },
  },

  create: {
    display: {
      label: 'Create User',
      description: 'Creates a new user.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true, label: "Name", helpText: "What's the name of the user?"},
        {key: 'email', required: true, label: "Email", helpText: "What's the email of the user?"},
      ],
      perform: createUser
    },
  },

  sample: {
    id: 1,
    name: 'Test'
  },

  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Name'}
  ]
};
