// get a single incident
const getIncident = (z, bundle) => {
  const responsePromise = z.request({
    url: `https://api.pagertree.com/incident/${bundle.inputData.id}`,
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

// get a list of incidents
const listIncidents = (z) => {
  const responsePromise = z.request({
    url: 'https://api.pagertree.com/incident',
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content).data);
};

// find a particular incident by name
const searchIncidents = (z, bundle) => {
  const responsePromise = z.request({
    url: 'https://api.pagertree.com/incident',
    params: {
      query: `title=${bundle.inputData.name}`
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content).data);
};

// create a incident
const createIncident = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://api.pagertree.com/incident',
    body: {
      title: bundle.inputData.title, // json by default
      description: bundle.inputData.description,
      d_team_id: bundle.inputData.d_team_id,
      urgency: bundle.inputData.urgency
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

module.exports = {
  key: 'incident',
  noun: 'Incident',

  get: {
    display: {
      label: 'Get Incident',
      description: 'Gets a incident.'
    },
    operation: {
      inputFields: [
        {key: 'id', required: true}
      ],
      perform: getIncident
    }
  },

  list: {
    display: {
      label: 'New Incident',
      description: 'Lists the incidents.'
    },
    operation: {
      perform: listIncidents
    }
  },

  search: {
    display: {
      label: 'Find Incident',
      description: 'Finds a incident by searching.'
    },
    operation: {
      inputFields: [
        {key: 'title', required: true}
      ],
      perform: searchIncidents
    },
  },

  create: {
    display: {
      label: 'Create Incident',
      description: 'Creates a new incident.'
    },
    operation: {
      inputFields: [
        {key: 'title', required: true, label: "Title", helpText: "Title the incident!"},
        {key: 'description', required: true, label: "Description", helpText: "Describe the incident!"},
        {key: 'd_team_id', required: true, label: "Destination Team", dynamic: 'teamList.id.name', helpText: "Assign the incident to a team!"},
        {key: 'urgency', required: true, choices: { low: "low", medium: "medium", high: "high", critical: "critical", helpText: "How urgenct is the incident?"}},
      ],
      perform: createIncident
    },
  },

  sample: {
    id: 1,
    name: 'Test'
  },

  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'title', label: 'Title'}
  ]
};
