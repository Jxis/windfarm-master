import moment from "moment";
import React from "react";

const HistoryTable = ({ history }) => {

    if (!history) {
        return null;
    }

  return (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Production</th>
          <th>Profit</th>
        </tr>
      </thead>
      <tbody>
        {history.map((item, index) => (
          <tr key={index}>
            <td>
              {moment(item.time).format("YYYY-MM-DD HH:mm")}
            </td>
            <td>{item.production}</td>
            <td>{item.profit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryTable;
