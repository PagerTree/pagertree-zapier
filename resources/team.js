// get a single team
const getTeam = (z, bundle) => {
  const responsePromise = z.request({
    url: `https://api.pagertree.com/team/${bundle.inputData.id}`,
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

// get a list of teams
const listTeams = (z) => {
  const responsePromise = z.request({
    url: 'https://api.pagertree.com/team',
    params: {
      order_by: 'id desc'
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content).data);
};

// find a particular team by name
const searchTeams = (z, bundle) => {
  const responsePromise = z.request({
    url: 'https://api.pagertree.com/team',
    params: {
      query: `name=${bundle.inputData.name}`
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content).data);
};

// create a team
const createTeam = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://api.pagertree.com/team',
    body: {
      name: bundle.inputData.name // json by default
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

module.exports = {
  key: 'team',
  noun: 'Team',

  get: {
    display: {
      label: 'Get Team',
      description: 'Gets a team.'
    },
    operation: {
      inputFields: [
        {key: 'id', required: true}
      ],
      perform: getTeam
    }
  },

  list: {
    display: {
      label: 'New Team',
      description: 'Lists the teams.'
    },
    operation: {
      perform: listTeams
    }
  },

  search: {
    display: {
      label: 'Find Team',
      description: 'Finds a team by searching.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: searchTeams
    },
  },

  create: {
    display: {
      label: 'Create Team',
      description: 'Creates a new team.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: createTeam
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
