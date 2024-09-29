import React, { useState, useEffect } from 'react';
import '../Dashboard/dash.css';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField'; // Import TextField from MUI
import Navbar from '../Navbar/navbar';


function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  

  useEffect(() => {
    // Fetch ticket data from an API or other data source
    const fetchData = async () => {
      const response = await fetch('/api/tickets'); // Example API endpoint
      const data = await response.json();
      setTickets(data);
    };

    fetchData();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const isWithinDateRange =
      (!startDate || dayjs(ticket.วันที่ออก).isSameOrAfter(startDate)) &&
      (!endDate || dayjs(ticket.วันที่ออก).isSameOrBefore(endDate));

    return (
      (ticket.หมายเลขใบสั่ง.includes(searchQuery) ||
        ticket.เลขบัตรประชาชน.includes(searchQuery) ||
        ticket.ผู้ขับขี่.includes(searchQuery)) && isWithinDateRange
    );
  });

  return (
    <>
    <Navbar />
    <div className="head">
      <div>
        <input className='search'
          type="text"
          placeholder="เช่น ชื่อผู้ขับขี่ หมายเลขใบสั่ง เลขประจำตัวประชาชน สถานะ"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button>ค้นหา</button>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="วันที่เริ่มต้น"
            value={startDate}
            onChange={newValue => setStartDate(newValue)}
            renderInput={params => <TextField {...params} />} // Use TextField here
          />
          <DatePicker
            label="วันที่สิ้นสุด"
            value={endDate}
            onChange={newValue => setEndDate(newValue)}
            renderInput={params => <TextField {...params} />} // Use TextField here
          />
        </LocalizationProvider>
      </div>

      <table class="table table-hover">
        <thead>
          <tr>
            <th>หมายเลขใบสั่ง</th>
            <th>เลขบัตรประชาชน</th>
            <th>ผู้ขับขี่</th>
            <th>วันที่ออก</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {/* {filteredTickets.map(ticket => (
            <tr key={ticket.หมายเลขใบสั่ง}>
              <td>{ticket.หมายเลขใบสั่ง}</td>
              <td>{ticket.เลขบัตรประชาชน}</td>
              <td>{ticket.ผู้ขับขี่}</td>
              <td>{ticket.วันที่ออก}</td>
              <td>{ticket.สถานะ}</td>
            </tr>
          ))} */}
        </tbody>
          <tr >
              <td>0001</td>
              <td>1470801393510</td>
              <td>กิจพานิช จิตเสีย</td>
              <td>19/08/2567</td>
              <td>ยังไม่ชำระ</td>
            </tr>
      </table>
    </div>
    </>
  );
}

export default Dashboard;
