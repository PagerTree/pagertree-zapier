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
      sort: 'createdAt',
      sortdirection: 'DESC'
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
      name: bundle.inputData.name
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
      name: bundle.inputData.name, // json by default
      description: bundle.inputData.description,
      member_user_ids: _.get(bundle.inputData.member_user_ids, "length", 0) ?
        bundle.inputData.member_user_ids :
        [ jwt.decode(bundle.authData.sessionKey).id ]
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
      label: 'List Teams',
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

  // create: {
  //   display: {
  //     label: 'Create Team',
  //     description: 'Creates a new team.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'name', required: true, label: "Name", helpText: "What's the name of the team?"},
  //       {key: 'description', required: true, label: "Description", helpText: "What does this team do?"},
  //       {key: 'member_user_ids', required: true, label: "Team Members", dynamic: 'userList.id.name', helpText: "Who should be on the team?", "list": true},
  //     ],
  //     perform: createTeam
  //   },
  // },

  sample: {
    id: 1,
    name: 'Test'
  },

  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Name'}
  ]
};
