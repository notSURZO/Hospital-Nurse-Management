import React, { useState, useEffect } from 'react';
import { fetchPayrolls, createPayroll } from '../api';
import Navbar from './Navbar';  // Import the Navbar component
import '../payroll.css';

const Payroll = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [nurseId, setNurseId] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [salary, setSalary] = useState('');
    const [overtime, setOvertime] = useState('');
    const [deductions, setDeductions] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null); // Added state for user info

    // Fetch user info from localStorage on component mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            setNurseId(storedUser.id); // Set the Nurse ID from the user info
        }

        // Set the default month and year to the current values
        const currentDate = new Date();
        setMonth(currentDate.getMonth() + 1); // Months are 0-indexed, so adding 1
        setYear(currentDate.getFullYear()); // Current year
    }, []);

    const loadPayrolls = async () => {
        setLoading(true);
        try {
            const response = await fetchPayrolls();
            setPayrolls(response.data);
        } catch (error) {
            console.error('Error fetching payrolls:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthName = monthNames[parseInt(month, 10) - 1]; // Convert month number to month name

        try {
            const response = await createPayroll({
                nurseId,
                month: monthName, // Use month name instead of number
                year: parseInt(year, 10),
                salary: parseFloat(salary),
                overtime: parseFloat(overtime),
                deductions: parseFloat(deductions),
            });
            loadPayrolls();
            // Reset form fields
            setMonth('');
            setYear('');
            setSalary('');
            setOvertime('');
            setDeductions('');
        } catch (error) {
            console.error('Error creating payroll:', error);
        }
    };

    useEffect(() => {
        loadPayrolls();
    }, []);

    return (
        <div className="payroll-container">
            <h2 className="title">Payroll Management</h2>
            <form onSubmit={handleSubmit} className="payroll-form">
                {/* Display user info */}
                <input
                    type="text"
                    placeholder="User"
                    value={user ? `${user.firstName} ${user.lastName}` : 'Loading...'} // Display user name or loading message
                    disabled
                    className="input-field"
                />
                <input
                    type="number"
                    placeholder="Month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                    className="input-field"
                />
                <input
                    type="number"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="input-field"
                />
                <input
                    type="number"
                    placeholder="Salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                    className="input-field"
                />
                <input
                    type="number"
                    placeholder="Overtime"
                    value={overtime}
                    onChange={(e) => setOvertime(e.target.value)}
                    className="input-field"
                />
                <input
                    type="number"
                    placeholder="Deductions"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    className="input-field"
                />
                <button type="submit" className="submit-btn">Add Payroll</button>
            </form>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <ul className="payroll-list">
                    {payrolls.length > 0 ? (
                        payrolls.map((payroll) => (
                            <li key={payroll._id} className="payroll-item">
                                {/* Display Nurse Name (after populating nurse info in backend) */}
                                <p><strong>Nurse Name:</strong> {payroll.nurseId ? `${payroll.nurseId.firstName} ${payroll.nurseId.lastName}` : 'N/A'}</p>
                                <p><strong>Month:</strong> {payroll.month} {payroll.year}</p>
                                <p><strong>Salary:</strong> ${payroll.salary}</p>
                                {payroll.overtime && <p><strong>Overtime:</strong> ${payroll.overtime}</p>}
                                {payroll.deductions && <p><strong>Deductions:</strong> ${payroll.deductions}</p>}
                            </li>
                        ))
                    ) : (
                        <li>No payroll records found.</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Payroll;
