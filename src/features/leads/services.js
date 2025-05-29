
const dummyLeads = [
    {
      id: 1,
      name: "Alice Johnson",
      company: "Acme Inc.",
      status: "In Progress",
      source: "Website",
      assignedTo: "rep@crm.com",
      priority: "High",
    },
    {
      id: 2,
      name: "Bob Smith",
      company: "Tech Co.",
      status: "Converted",
      source: "Referral",
      assignedTo: "manager@crm.com",
      priority: "Low",
    },
    
  ];
  
  export async function fetchLeads() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(dummyLeads), 500); // simulating API delay
    });
  }
  export function assignLeads({ ids, assignee }) {
    leadsMock = leadsMock.map((lead) =>
      ids.includes(lead.id) ? { ...lead, assignedTo: assignee } : lead
    );
    return Promise.resolve(leadsMock);
  }