import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './mobile.css';
import axios from 'axios';
import dayjs from 'dayjs';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Navbar from '../Navbar/navbar';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Mobiledasboard() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false); // state for pop-up visibility
  const [selectedOrder, setSelectedOrder] = useState(null); // state for selected order
  const [cancelDescriptDialogOpen, setCancelDescriptDialogOpen] = useState(false); // state for cancel descript dialog
  const [cancelDescript, setCancelDescript] = useState(''); // state for cancel descript input

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/tickets');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Error fetching orders. Please try again later.');
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => dayjs(dateString, 'D/M/YYYY');

  const filteredOrders = orders.filter((order) => {
    const isWithinDateRange =
      (!startDate || formatDate(order.issueDate).isAfter(startDate, 'day'))
      &&
      (!endDate || formatDate(order.issueDate).isBefore(endDate, 'day'));

    return (
      (order.driverName.includes(searchTerm) || order.citizenID.includes(searchTerm) ||
        order.ticketNumber.toString().includes(searchTerm)) && isWithinDateRange
    );
  });

  // Handle edit button click
  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsEditOpen(true);
  };

  // Close the edit pop-up
  const closeEditPopup = () => {
    setIsEditOpen(false);
    setSelectedOrder(null);
  };

  // Handle the update click
  const handleUpdateClick = () => {
    const confirmed = window.confirm('คุณต้องการอัปเดตข้อมูลใบสั่งนี้หรือไม่?');

    if (confirmed) {
      setCancelDescriptDialogOpen(true); // Open the cancel description dialog
    }
  };

  // Save the cancel description and update the ticket
  const handleSaveCancelDescript = async () => {
    try {
      const updatedOrder = {
        ...selectedOrder,
        cancelDescript
      };

      await axios.put(`http://127.0.0.1:5000/api/tickets/${selectedOrder._id}`, updatedOrder);
      setCancelDescriptDialogOpen(false); // Close the cancel description dialog
      closeEditPopup(); // Close the edit popup
      alert('ข้อมูลใบสั่งได้รับการอัปเดตแล้ว');

      // Optionally, refetch the data or update the local state
      const response = await axios.get('http://127.0.0.1:5000/api/tickets');
      setOrders(response.data);

    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูลใบสั่ง');
    }
  };

  return (
    <>
      <div className="order-container">
        <Navbar />
        <div className="main-container">
          <header className="header">
            <h2>รายการใบสั่ง</h2>
            <button className="add-btn" onClick={() => navigate('/citizenDash')}>เพิ่มใบสั่ง</button>
          </header>

          <div className="search-container">
            <input className="search-bar"
              type="text"
              placeholder="ค้นหา : ชื่อ เลขบัตรประชาชน"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="datepickers-container">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="วันที่เริ่มต้น"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ marginTop: '10px' }}
                    />
                  )}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="วันที่สิ้นสุด"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{ marginTop: '10px' }}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
          </div>

          <hr className='hr-line'></hr>

          <div className="order-list">
            {filteredOrders.length > 0 ? (
              filteredOrders
                .sort((a, b) => dayjs(b.issueDate).valueOf() - dayjs(a.issueDate).valueOf()) // Sort orders by issueDate in descending order
                .map((order) => (
                  <div className="order-card" key={order.ticketNumber}>
                    {/* order-header */}
                    <div className="order-customer"><strong>หมายเลขใบสั่ง :</strong> {order.ticketNumber}
                      {/* <span>หมายเลขใบสั่ง : {order.ticketNumber}</span> */}
                      {/* <span>วันที่กระทำผิด : {dayjs(order.issueDate).format('D/M/YYYY')}</span> */}
                    </div>
                    <div className="order-customer"><strong>วันที่กระทำผิด :</strong> {dayjs(order.issueDate).format('D/M/YYYY')}</div>
                    <div className="order-customer"> <strong>ผู้ขับขี่ :</strong> {order.driverName}</div>
                    <div className="order-customer"><strong>เลขบัตรประชาชน :</strong> {order.citizenID}</div>
                    {/* order-status */}
                    <div className="order-customer"><strong>สถานะใบสั่ง : </strong>
                      <span style={{ color: order.status === 'ชำระเสร็จสิ้น' ? 'green' : order.status === 'รอการชำระ' ? 'orange' : 'red' }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "0.75rem", transition: "color 0.3s ease"}}>
                      <button className="edit-btn" onClick={() => handleEditClick(order)}>
                        <VisibilityIcon color="primary" fontSize="large" />
                      </button>
                    </div>
                    {/* <button className="edit-btn" onClick={() => handleEditClick(order)}>
                        <VisibilityIcon color="primary" fontSize="large" align-items="end" />
                      </button> */}
                  </div>
                ))
            ) : (
              <div className="no-orders">ไม่พบข้อมูลใบสั่ง</div>
            )}
          </div>

          {/* Edit Pop-up */}
          <Dialog open={isEditOpen} onClose={closeEditPopup} maxWidth="sm" fullWidth>
            <DialogTitle fontSize='28px' fontWeight='bold' align='center'>รายละเอียดใบสั่ง</DialogTitle>
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
                      InputProps={{ readOnly: true }} // This field is read-only
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>ชื่อผู้ขับขี่</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.driverName || ''}
                      InputProps={{ readOnly: true }} // This field is editable
                      onChange={(e) => {
                        setSelectedOrder({
                          ...selectedOrder,
                          driverName: e.target.value
                        });
                      }}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>เลขใบขับขี่</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.licenseID || ''}
                      InputProps={{ readOnly: true }} // This field is editable
                      onChange={(e) => {
                        setSelectedOrder({
                          ...selectedOrder,
                          licenseID: e.target.value
                        });
                      }}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>ประเภทรถ</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.carType || ''}
                      InputProps={{ readOnly: true }} // This field is editable
                      onChange={(e) => {
                        setSelectedOrder({
                          ...selectedOrder,
                          carType: e.target.value
                        });
                      }}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>เลขป้ายทะเบียน</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.licensePlateID || ''}
                      InputProps={{ readOnly: true }} // This field is editable
                      onChange={(e) => {
                        setSelectedOrder({
                          ...selectedOrder,
                          licensePlateID: e.target.value
                        });
                      }}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>ฐานความผิด</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.issueType || ''}
                      InputProps={{ readOnly: true }} // This field is editable
                      onChange={(e) => {
                        setSelectedOrder({
                          ...selectedOrder,
                          issueType: e.target.value
                        });
                      }}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>รายละเอียด</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.details || ''}
                      InputProps={{ readOnly: true }} // This field is editable
                      onChange={(e) => {
                        setSelectedOrder({
                          ...selectedOrder,
                          details: e.target.value
                        });
                      }}
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

                  <div className="edit-popup-field">
                    <label>ค่าปรับ:</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.cost || ''}
                      InputProps={{ readOnly: false }} // This field is editable
                      onChange={(e) => {
                        setSelectedOrder({
                          ...selectedOrder,
                          cost: e.target.value
                        });
                      }}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>เหตุยกเลิกใบสั่ง:</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={selectedOrder.cancelDescript || ''}
                      InputProps={{ readOnly: true }} // This field will be updated later
                      onChange={(e) => {
                        setSelectedOrder({
                          ...selectedOrder,
                          cancelDescript: e.target.value
                        });
                      }}
                    />
                  </div>
                  <div className="edit-popup-field">
                    <label>วันออกใบสั่ง:</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={dayjs(selectedOrder.createdAt).format('D/M/YYYY') || ''}
                      InputProps={{ readOnly: true }} // This field is read-only
                    />
                  </div>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeEditPopup} color="primary">ปิด</Button>
              <Button onClick={handleUpdateClick} color="warning">อัปเดต</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={cancelDescriptDialogOpen} onClose={() => setCancelDescriptDialogOpen(false)} maxWidth="sm" fullWidth padding='5px'>
            <DialogTitle>กรุณาใส่เหตุยกเลิกใบสั่ง</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                padding='5px'
                variant="outlined"
                label="เหตุยกเลิกใบสั่ง"
                multiline
                rows={4}
                value={cancelDescript}
                onChange={(e) => setCancelDescript(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCancelDescriptDialogOpen(false)} color="primary">ยกเลิก</Button>
              <Button
                onClick={() => {
                  handleSaveCancelDescript();
                  setCancelDescriptDialogOpen(false);
                  setIsEditOpen(false);
                }}
                color="success"
                style={{ backgroundColor: 'green', color: 'white' }} // เพิ่มสีเขียวให้ปุ่ม
              >
                บันทึก
              </Button>
            </DialogActions>
          </Dialog>

        </div>
      </div>
    </>
  );
}

export default Mobiledasboard;

