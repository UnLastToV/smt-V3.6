import React, { useState, useEffect } from 'react';
import './citizen.css'
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Select, MenuItem, FormControl, InputLabel, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Navbar from '../Navbar/navbar';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';

const CitizenDash = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/citizens/');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => dayjs(dateString, 'D/M/YYYY');

  const filteredOrders = orders.filter((order) => {
    const isWithinDateRange =
      (!startDate || formatDate(order.issueDate).isAfter(startDate, 'day')) &&
      (!endDate || formatDate(order.issueDate).isBefore(endDate, 'day'));

    return (
      (order.driverName?.includes(searchTerm) || order.citizenID?.includes(searchTerm) ||
        order.ticketNumber?.toString().includes(searchTerm)) && isWithinDateRange
    );
  });


  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsEditOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateClick = async () => {
    const confirmed = window.confirm('คุณต้องการอัปเดตข้อมูลใบสั่งนี้หรือไม่?');

    if (confirmed) {
      try {
        await axios.put(`http://127.0.0.1:5000/citizens/${selectedOrder._id}`, selectedOrder);
        alert('ข้อมูลใบสั่งได้รับการอัปเดตแล้ว');
        closeEditPopup();
        const response = await axios.get('http://127.0.0.1:5000/citizens/');
        setOrders(response.data);
      } catch (error) {
        console.error('Error updating ticket:', error);
        alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูลใบสั่ง');
      }
    }
  };

  return (
    <>
      <div className="order-container">
        <Navbar />
        <div className="main-container">
          <header className="header">
            <h2>ค้นหารายชื่อ</h2>
          </header>

          <div className="search-container">
            <input className="search-bar"
              type="text"
              placeholder="ค้นหา : ชื่อ เลขบัตรประชาชน"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* <div className="datepickers-container">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="วันที่เริ่มต้น"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} sx={{ marginTop: '10px' }} />
                  )}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="วันที่สิ้นสุด"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth sx={{ marginTop: '10px' }} />
                  )}
                />
              </LocalizationProvider>
            </div> */}
          </div>

          <hr className='hr-line'></hr>

          <div className="order-list">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div className="order-card" key={order.citizenID}>
                  {/* order-header */}
                  <div className="order-customer"><strong>หมายเลขประชาชน :</strong> {order.citizenID}
                    {/* <span>หมายเลขประชาชน: {order.citizenID}</span> */}
                    {/* <span>เพศ : {order.Gender}</span> */}
                    {/* <span>วันที่ออกใบสั่ง: {dayjs(order.issueDate).format('D/M/YYYY')}</span> */}
                  </div>
                  <div className="order-customer"><strong>ชื่อ :</strong> {order.firstName} {order.lastName}</div>
                  <div className="order-customer"><strong>เพศ :</strong> {order.Gender}</div>
                  {/* order-status */}
                  {/* <div className="order-customer">
                    <span style={{ color: order.status === 'ชำระเสร็จสิ้น' ? 'green' : order.status === 'รอการชำระ' ? 'orange' : 'red' }}>
                      {order.status}
                    </span>
                  </div> */}
                  {/* <button className="edit-btn" onClick={() => handleEditClick(order)}><BorderColorOutlinedIcon color="primary" fontSize='large' /></button> */}
                  <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "0.75rem", transition: "color 0.3s ease"}}>
                      <button className="edit-btn" onClick={() => handleEditClick(order)}>
                      <BorderColorOutlinedIcon color="primary" fontSize="large" />
                      </button>
                    </div>
                </div>
                
              ))
            )
              : (
                <div className="no-orders">ไม่พบข้อมูลใบสั่ง</div>
              )}
          </div>

          {/* Edit Pop-up */}
          <Dialog open={isEditOpen} onClose={closeEditPopup} maxWidth="sm" fullWidth>
            <DialogTitle fontSize='28px' fontWeight='bold' align='center'>เขียนใบสั่งจราจร</DialogTitle>
            <DialogContent>
              {selectedOrder && (
                <>
                  <div className="edit-popup-field">
                    <label>หมายเลขใบสั่ง</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.ticketNumber || ''}
                      InputProps={{ readOnly: true }}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>เลขบัตรประชาชน</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.citizenID || ''}
                      InputProps={{ readOnly: true }}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>ชื่อผู้ขับขี่</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={`${selectedOrder.firstName || ''} ${selectedOrder.lastName || ''}`}
                      onChange={(e) => {
                        const fullName = e.target.value.split(' '); // แยกด้วยช่องว่าง
                        const firstName = fullName[0] || ''; // ชื่อแรก
                        const lastName = fullName.slice(1).join(' ') || ''; // นามสกุล
                        setSelectedOrder({ ...selectedOrder, firstName, lastName });
                      }}
                      InputProps={{ readOnly: true }}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>เลขใบขับขี่</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.licenseID || ''}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, licenseID: e.target.value })}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>ประเภทรถ</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.carType || ''}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, carType: e.target.value })}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>เลขป้ายทะเบียน</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.licensePlateID || ''}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, licensePlateID: e.target.value })}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>ฐานความผิด</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.issueType || ''}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, issueType: e.target.value })}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>รายละเอียด</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.details || ''}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, details: e.target.value })}
                    />
                  </div>
                  <div className="edit-popup-field">
                  <label>สถานะ</label>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>เลือก</InputLabel>
                      <Select
                        value={selectedOrder.status || ''}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
                        label="สถานะ"
                      >
                        <MenuItem value="ชำระเสร็จสิ้น" color='green'>ชำระเสร็จสิ้น</MenuItem>
                        <MenuItem value="รอการชำระ">รอการชำระ</MenuItem>
                        <MenuItem value="ยกเลิกใบสั่ง">ยกเลิกใบสั่ง</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  {/* <FormControl fullWidth variant="outlined">
                    <InputLabel>สถานะ</InputLabel>
                    <Select
                      value={selectedOrder.status || ''}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
                      label="สถานะ"
                    >
                      <MenuItem value="ชำระเสร็จสิ้น" color='green'>ชำระเสร็จสิ้น</MenuItem>
                      <MenuItem value="รอการชำระ">รอการชำระ</MenuItem>
                      <MenuItem value="ยกเลิกใบสั่ง">ยกเลิกใบสั่ง</MenuItem>
                    </Select>
                  </FormControl> */}
                  <div className="edit-popup-field">
                    <label>ค่าปรับ:</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.cost || ''}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, cost: e.target.value })}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>เหตุยกเลิกใบสั่ง:</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.cancelDescript || ''}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, cancelDescript: e.target.value })}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>วันที่กระทำผิด:</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={dayjs(selectedOrder.createdAt).format('D/M/YYYY') || ''}
                      InputProps={{ readOnly: true }}
                    />
                  </div>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeEditPopup} color="primary-outline">ปิด</Button>
              <Button onClick={handleUpdateClick} color="primary">เขียนใบสั่ง</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default CitizenDash;

