export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;

  // Extract headers
  const headers = Object.keys(data[0]).filter(key => key !== '_id' && key !== '__v');
  
  // Convert rows
  const csvRows = [];
  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      let value = row[header];
      // Format dates
      if (header === 'date' || header === 'createdAt' || header === 'updatedAt') {
        value = new Date(value).toLocaleDateString();
      }
      // Escape strings with commas
      if (typeof value === 'string') {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }

  // Create blob and trigger download
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
