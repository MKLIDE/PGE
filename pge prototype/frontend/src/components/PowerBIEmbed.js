import React from 'react';


export default function PowerBIEmbed() {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3>Power BI Insights</h3>
      <iframe
        title="Power BI Dashboard"
        width="100%"
        height="600"
        src="https://app.powerbi.com/reportEmbed?reportId=74b0daf3-5b04-40c3-a567-8163ad59de7a&autoAuth=true&ctid=ed68e035-72c6-4a78-be78-279b3eefb921"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
}
