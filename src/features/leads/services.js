
let leadsMock = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@acme.com",
    company: "Acme Inc.",
    status: "In Progress",
    source: "Website",
    assignedTo: "rep@crm.com",
    priority: "High",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@techco.com",
    company: "Tech Co.",
    status: "Converted",
    source: "Referral",
    assignedTo: "manager@crm.com",
    priority: "Low",
  }, 
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.brown@innovate.com",
    company: "Innovate LLC",
    status: "New",
    source: "Email Campaign",
    assignedTo: "rep@crm.com",
    priority: "Medium",
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana.prince@globalcorp.com",
    company: "Global Corp.",
    status: "Contacted",
    source: "Social Media",
    assignedTo: "manager@crm.com",
    priority: "High",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    email: "ethan.hunt@missiontech.com",
    company: "Mission Tech",
    status: "In Progress",
    source: "Cold Call",
    assignedTo: "rep@crm.com",
    priority: "Low",
  }
];

  export async function fetchLeads() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(leadsMock), 500); // simulating API delay
    });
  }
  export function assignLeads({ ids, assignee }) {
    leadsMock = leadsMock.map((lead) =>
      ids.includes(lead.id) ? { ...lead, assignedTo: assignee } : lead
    );
    return Promise.resolve(leadsMock);
  }

  export function updateLeadsStatus({ ids, status }) {
    leadsMock = leadsMock.map((lead) =>
      ids.includes(lead.id) ? { ...lead, status } : lead
    );
    return Promise.resolve(leadsMock);
  }

export function deleteLeads({ ids }) {
  leadsMock = leadsMock.filter((lead) => !ids.includes(lead.id));
  return Promise.resolve(leadsMock);
}


// let nextId = 6; // Start from 6 since we have 5 initial leads

// export function addLead(newLead) {
//   const leadToAdd = { id: nextId++, ...newLead };
//   leadsMock.push(leadToAdd);
//   return Promise.resolve(leadToAdd);
// }

export function addLead(newLead) {
  const newId = Math.max(...leadsMock.map((l) => l.id)) + 1;
  leadsMock.push({ ...newLead, id: newId });
  return Promise.resolve(leadsMock);
}

export function editLead(updatedLead) {
  leadsMock = leadsMock.map((lead) =>
    lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead
  );
  return Promise.resolve(updatedLead);
}
